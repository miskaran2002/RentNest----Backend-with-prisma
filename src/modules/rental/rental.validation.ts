import { z } from 'zod';

const createRentalRequestZodSchema = z.object({
  body: z.object({
    propertyId: z.string({
      message: 'PropertyId is required',
    }).uuid({ message: 'PropertyId must be a valid UUID' }),
    startDate: z.coerce.date({
      message: 'Start date is required and must be a valid date',
    }),
    endDate: z.coerce.date({
      message: 'End date is required and must be a valid date',
    }),
  }),
});

const updateRentalRequestStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'], {
      message: 'Status must be APPROVED, REJECTED, ACTIVE, COMPLETED, or CANCELLED',
    }),
  }),
});

export const RentalValidation = {
  createRentalRequestZodSchema,
  updateRentalRequestStatusZodSchema,
};