import { z } from 'zod';

const createPropertyZodSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Title is required',
    }).min(3, { message: 'Title must be at least 3 characters long' }),
    description: z.string({
      message: 'Description is required',
    }),
    location: z.string({
      message: 'Location is required',
    }),
    price: z.number({
      message: 'Price is required and must be a number',
    }).positive({ message: 'Price must be a positive number' }),
    images: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    categoryId: z.string({
      message: 'CategoryId is required',
    }).uuid({ message: 'CategoryId must be a valid UUID' }),
  }),
});

const updatePropertyZodSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    price: z.number().positive().optional(),
    status: z.enum(['AVAILABLE', 'RENTED', 'INACTIVE']).optional(),
    images: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

export const PropertyValidation = {
  createPropertyZodSchema,
  updatePropertyZodSchema,
};