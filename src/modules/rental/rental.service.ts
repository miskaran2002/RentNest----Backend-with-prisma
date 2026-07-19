import { prisma } from '../../lib/prisma';

import { IRentalRequestInput } from './rental.interface';
import { RentalStatus } from '../../../generated/prisma/client';
import AppError from '../../utilities/AppError';

// Create rental request
const createRentalRequestInDB = async (tenantId: string, payload: IRentalRequestInput) => {
  const { propertyId, startDate, endDate } = payload;

  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError(400, 'Start date must be before end date');
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(404, 'Property listing not found');
  }

  if (property.status !== 'AVAILABLE') {
    throw new AppError(400, 'This property is not currently available for rent');
  }

  if (property.landlordId === tenantId) {
    throw new AppError(400, 'You cannot submit a rental request for your own property');
  }

  const result = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      startDate,
      endDate,
      status: 'PENDING',
    },
    include: {
      property: true,
    },
  });

  return result;
};

// Get all rental requests
const getAllRentalRequestsFromDB = async (userId: string, role: string) => {
  let whereConditions = {};

  if (role === 'TENANT') {
    whereConditions = { tenantId: userId };
  } else if (role === 'LANDLORD') {
    whereConditions = {
      property: {
        landlordId: userId,
      },
    };
  } else if (role === 'ADMIN') {
    whereConditions = {};
  }

  const result = await prisma.rentalRequest.findMany({
    where: whereConditions,
    include: {
      property: {
        include: {
          category: true,
        },
      },
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

// Get rental request by id
const getRentalRequestByIdFromDB = async (id: string, userId: string, role: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
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
  });

  if (!rental) {
    throw new AppError(404, 'Rental request not found');
  }

  const isTenantOwner = rental.tenantId === userId;
  const isLandlordOwner = rental.property.landlordId === userId;

  if (role !== 'ADMIN' && !isTenantOwner && !isLandlordOwner) {
    throw new AppError(403, 'Forbidden. You do not have permission to view this rental request');
  }

  return rental;
};

// Update rental request status
const updateRentalRequestStatusInDB = async (
  id: string,
  landlordId: string,
  role: string,
  status: RentalStatus
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new AppError(404, 'Rental request not found');
  }

  if (role !== 'ADMIN' && rental.property.landlordId !== landlordId) {
    throw new AppError(403, 'Forbidden. You do not own the property of this rental request');
  }

  // Update rental request status
  const updatedRental = await prisma.$transaction(async (tx) => {
    const result = await tx.rentalRequest.update({
      where: { id },
      data: { status },
    });

    if (status === 'APPROVED' || status === 'ACTIVE') {
      await tx.property.update({
        where: { id: rental.propertyId },
        data: { status: 'RENTED' }, // enums.prisma থেকে নেওয়া
      });
    } else if (status === 'COMPLETED' || status === 'REJECTED' || status === 'CANCELLED') {
      await tx.property.update({
        where: { id: rental.propertyId },
        data: { status: 'AVAILABLE' }, // enums.prisma থেকে নেওয়া
      });
    }

    return result;
  });

  return updatedRental;
};

export const RentalService = {
  createRentalRequestInDB,
  getAllRentalRequestsFromDB,
  getRentalRequestByIdFromDB,
  updateRentalRequestStatusInDB,
};