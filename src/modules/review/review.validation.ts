import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    propertyId: z.string({
      message: 'PropertyId is required',
    }).uuid({ message: 'PropertyId must be a valid UUID' }),
    rentalRequestId: z.string().uuid().optional(),
    rating: z.number({
      message: 'Rating is required and must be a number',
    })
    .int({ message: 'Rating must be an integer' })
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating cannot be more than 5' }),
    comment: z.string({
      message: 'Comment is required',
    }).min(5, { message: 'Comment must be at least 5 characters long' }),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
};