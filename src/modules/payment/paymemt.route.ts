import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../mddlewires/auth.middleware';

const router = express.Router();

// ১. Stripe Checkout Session তৈরি করা (POST /api/payments/create)
router.post(
  '/create',
  auth('TENANT'),
  PaymentController.createPaymentSession
);

// ২. Stripe Webhook Confirm Receiver (POST /api/payments/confirm)
// নোট: express.raw মিডলওয়্যারটি ওয়েবহুকের জন্য র ডাটা নিশ্চিত করবে
router.post(
  '/confirm',
  express.raw({ type: 'application/json' }),
  PaymentController.handleWebhook
);

// ৩. পেমেন্ট হিস্ট্রি দেখা (GET /api/payments)
router.get(
  '/',
  auth('TENANT', 'LANDLORD', 'ADMIN'),
  PaymentController.getMyPayments
);

// ৪. নির্দিষ্ট পেমেন্ট ডিটেইলস দেখা (GET /api/payments/:id)
router.get(
  '/:id',
  auth('TENANT', 'LANDLORD', 'ADMIN'),
  PaymentController.getPaymentById
);

export const PaymentRoutes = router;