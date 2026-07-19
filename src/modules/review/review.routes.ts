import express from 'express';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
import auth from '../../mddlewires/auth.middleware';
import validateRequest from '../../mddlewires/validateRequest';

const router = express.Router();

// ১. টেন্যান্ট নতুন রিভিউ পোস্ট করতে পারবে
router.post(
  '/',
  auth('TENANT'),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview
);

// ২. পাবলিক এন্ডপয়েন্ট: যে কেউ প্রপার্টির রিভিউ দেখতে পারবে
router.get(
  '/property/:propertyId',
  ReviewController.getPropertyReviews
);

export const ReviewRoutes = router;