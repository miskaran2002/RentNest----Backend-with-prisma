import { RentalStatus } from '../../../generated/prisma/client';

export type IRentalRequestInput = {
  propertyId: string;
  startDate: Date;
  endDate: Date;
};

export type IRentalStatusUpdateInput = {
  status: RentalStatus;
};