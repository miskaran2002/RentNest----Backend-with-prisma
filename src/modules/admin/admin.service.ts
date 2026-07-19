import { prisma } from '../../lib/prisma';

const getAllPropertiesFromDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      category: true,
      landlord: {
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


const getAllRentalRequestsFromDB = async () => {
  const result = await prisma.rentalRequest.findMany({
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
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};


const getPlatformOverviewFromDB = async () => {
  const totalUsers = await prisma.user.count();
  const totalProperties = await prisma.property.count();
  const totalRentals = await prisma.rentalRequest.count();

  const totalEarningsResult = await prisma.payment.aggregate({
    where: {
      status: 'COMPLETED',
    },
    _sum: {
      amount: true,
    },
  });

  return {
    totalUsers,
    totalProperties,
    totalRentals,
    totalEarnings: totalEarningsResult._sum.amount || 0,
  };
};

export const AdminService = {
  getAllPropertiesFromDB,
  getAllRentalRequestsFromDB,
  getPlatformOverviewFromDB,
};