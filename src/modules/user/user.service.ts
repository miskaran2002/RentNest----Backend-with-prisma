import { prisma } from '../../lib/prisma';
import AppError from '../../utilities/AppError';



const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User profile not found');
  }

  return user;
};


const updateMyProfileInDB = async (userId: string, payload: { name?: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User profile not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};


const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
};

const updateUserStatusInDB = async (userId: string, isBanned: boolean) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  
  if (user.role === 'ADMIN') {
    throw new AppError(400, 'Admin accounts cannot be banned or suspended');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const UserService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
  getAllUsersFromDB,
  updateUserStatusInDB,
};