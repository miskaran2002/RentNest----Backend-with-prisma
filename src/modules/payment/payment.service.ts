import { prisma } from '../../lib/prisma';
import { stripe } from '../../lib/stripe';
import config from '../../config';

import Stripe from 'stripe';
import AppError from '../../utilities/AppError';

const createCheckoutSession = async (tenantId: string, rentalRequestId: string) => {
  // ১. রেন্টাল রিকোয়েস্ট খুঁজে বের করা
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new AppError(404, 'Rental request not found');
  }

  // ২. সিকিউরিটি চেক: শুধু নিজের রিকোয়েস্টে পে করা যাবে
  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(403, 'Forbidden. You do not own this rental request');
  }

  // ৩. স্ট্যাটাস চেক: রিকোয়েস্টটি অবশ্যই APPROVED হতে হবে
  if (rentalRequest.status !== 'APPROVED') {
    throw new AppError(400, 'Payment can only be initiated for APPROVED rental requests');
  }

  // ৪. ডুপ্লিকেট সফল পেমেন্ট চেক (আগে পরিশোধ করা হয়েছে কিনা)
  const existingCompletedPayment = await prisma.payment.findFirst({
    where: {
      rentalRequestId,
      status: 'COMPLETED',
    },
  });

  if (existingCompletedPayment) {
    throw new AppError(400, 'This rental request has already been paid for');
  }

  const amountInCents = Math.round(rentalRequest.property.price * 100);

  // ৫. Stripe Checkout Session তৈরি করা
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: (await prisma.user.findUnique({ where: { id: tenantId } }))?.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: rentalRequest.property.title,
            description: `Rental payment for property in ${rentalRequest.property.location}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/payment/cancel`,
    metadata: {
      rentalRequestId,
      tenantId,
    },
  });

  // ৬. ⚠️ ডুপ্লিকেট এরর এড়াতে চেকআউট হ্যান্ডলার আপডেট:
  // যদি আগে থেকেই একটি PENDING পেমেন্ট রো থাকে, তবে নতুন সেশন আইডি দিয়ে সেটি আপডেট করুন।
  // অন্যথায় নতুন একটি রো তৈরি করুন।
  const existingPendingPayment = await prisma.payment.findFirst({
    where: {
      rentalRequestId,
      status: 'PENDING',
    },
  });

  if (existingPendingPayment) {
    await prisma.payment.update({
      where: { id: existingPendingPayment.id },
      data: {
        transactionId: session.id, // নতুন স্ট্রাইপ সেশন আইডি
        amount: rentalRequest.property.price,
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        transactionId: session.id,
        rentalRequestId,
        amount: rentalRequest.property.price,
        provider: 'STRIPE',
        status: 'PENDING',
      },
    });
  }

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

// ৭. Webhook কনফার্মেশন প্রসেস করা
const handleWebhookInDB = async (signature: string, payload: Buffer) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.log("❌ STRIPE WEBHOOK ERROR:", err.message); 
    throw new AppError(400, `Webhook Signature Verification Failed: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const transactionId = session.id;
    const rentalRequestId = session.metadata?.rentalRequestId;

    if (!rentalRequestId) {
      throw new AppError(400, 'Invalid session metadata: Missing rentalRequestId');
    }

    // প্রিজমা ট্রানজেকশন: পেমেন্ট COMPLETED -> রেন্টাল ACTIVE -> প্রপার্টি RENTED
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { transactionId },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });

      await tx.rentalRequest.update({
        where: { id: rentalRequestId },
        data: {
          status: 'ACTIVE',
        },
      });

      const rental = await tx.rentalRequest.findUnique({
        where: { id: rentalRequestId },
      });

      if (rental) {
        await tx.property.update({
          where: { id: rental.propertyId },
          data: {
            status: 'RENTED',
          },
        });
      }
    });
  }

  return { received: true };
};

// ৮. ইউজার রোল অনুযায়ী পেমেন্ট হিস্ট্রি রিটার্ন করা
const getMyPaymentsFromDB = async (userId: string, role: string) => {
  let whereConditions = {};

  if (role === 'TENANT') {
    whereConditions = {
      rentalRequest: {
        tenantId: userId,
      },
    };
  } else if (role === 'LANDLORD') {
    whereConditions = {
      rentalRequest: {
        property: {
          landlordId: userId,
        },
      },
    };
  } else if (role === 'ADMIN') {
    whereConditions = {};
  }

  const result = await prisma.payment.findMany({
    where: whereConditions,
    include: {
      rentalRequest: {
        include: {
          property: true,
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

// ৯. নির্দিষ্ট পেমেন্ট ট্রানজেকশন ডিটেইলস দেখা
const getPaymentByIdFromDB = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      rentalRequest: {
        include: {
          property: true,
          tenant: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(404, 'Payment transaction record not found');
  }

  const isTenantOwner = payment.rentalRequest.tenantId === userId;
  const isLandlordOwner = payment.rentalRequest.property.landlordId === userId;

  if (role !== 'ADMIN' && !isTenantOwner && !isLandlordOwner) {
    throw new AppError(403, 'Unauthorized access to this payment transaction');
  }

  return payment;
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhookInDB,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};