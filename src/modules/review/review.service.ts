import { prisma } from '../../lib/prisma';
import AppError from '../../utilities/AppError';
import { IReviewInput } from './review.interface';

// ১. টেন্যান্ট কর্তৃক রিভিউ তৈরি করা (শুধুমাত্র নিজের ভাড়াকৃত বাসায়)
const createReviewInDB = async (tenantId: string, payload: IReviewInput) => {
  const { propertyId, rating, comment } = payload;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(404, 'Property listing not found');
  }

  // সুরক্ষাকবচ: শুধুমাত্র ACTIVE বা COMPLETED রেন্টাল রিকোয়েস্ট থাকলেই রিভিউ দেওয়া যাবে
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: {
        in: ['ACTIVE', 'COMPLETED'],
      },
    },
  });

  if (!rentalRequest) {
    throw new AppError(
      400,
      'Forbidden. You can only leave a review for properties you have actively rented or completed renting.'
    );
  }

  // একটি রেন্টাল সেশনের জন্য একাধিক রিভিউ এড়ানো
  const existingReview = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId,
      rentalRequestId: rentalRequest.id,
    },
  });

  if (existingReview) {
    throw new AppError(400, 'You have already submitted a review for this rental contract');
  }

  const result = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rentalRequestId: rentalRequest.id,
      rating,
      comment,
    },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

// ২. যেকোনো প্রপার্টির সব রিভিউ দেখা (পাবলিক)
const getPropertyReviewsFromDB = async (propertyId: string) => {
  const result = await prisma.review.findMany({
    where: { propertyId },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

export const ReviewService = {
  createReviewInDB,
  getPropertyReviewsFromDB,
};