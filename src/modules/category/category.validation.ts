import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Category name is required',
      })
      .min(2, { message: 'Category name must be at least 2 characters long' }),
    description: z.string().optional(),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};