import { z } from 'zod';

const updateUserProfileZodSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .optional(),
  }),
});

const updateUserStatusZodSchema = z.object({
  body: z.object({
    isBanned: z.boolean({
      message: 'isBanned field is required and must be a boolean value', // required_error পরিবর্তন করে message করা হয়েছে
    }),
  }),
});

export const UserValidation = {
  updateUserProfileZodSchema,
  updateUserStatusZodSchema,
};