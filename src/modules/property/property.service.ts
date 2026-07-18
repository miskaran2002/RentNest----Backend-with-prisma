import { prisma } from '../../lib/prisma';
import AppError from '../../utilities/AppError';

import { IPropertyInput, IPropertyFilterQuery } from './property.interface';


const createPropertyInDB = async (landlordId: string, payload: IPropertyInput) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
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
  });

  return result;
};


const getAllPropertiesFromDB = async (filters: IPropertyFilterQuery) => {
  const { searchTerm, location, minPrice, maxPrice, categoryId, amenities } = filters;

  const andConditions: any[] = [];
  andConditions.push({ status: 'AVAILABLE' });

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (location) {
    andConditions.push({
      location: { contains: location, mode: 'insensitive' },
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (minPrice) {
    andConditions.push({
      price: { gte: parseFloat(minPrice) },
    });
  }

  if (maxPrice) {
    andConditions.push({
      price: { lte: parseFloat(maxPrice) },
    });
  }

  if (amenities) {
    const amenitiesList = amenities.split(',');
    andConditions.push({
      amenities: { hasEvery: amenitiesList },
    });
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.property.findMany({
    where: whereConditions,
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


const getPropertyByIdFromDB = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: {
        include: {
          tenant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new AppError(404, 'Property listing not found');
  }

  return result;
};


const updatePropertyInDB = async (
  propertyId: string,
  landlordId: string,
  role: string,
  payload: Partial<IPropertyInput>
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(404, 'Property listing not found');
  }

  
  if (role !== 'ADMIN' && property.landlordId !== landlordId) {
    throw new AppError(403, 'Forbidden. You do not own this property listing.');
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!category) {
      throw new AppError(404, 'Category not found');
    }
  }

  const result = await prisma.property.update({
    where: { id: propertyId },
    data: payload,
    include: {
      category: true,
    },
  });

  return result;
};


const deletePropertyFromDB = async (propertyId: string, landlordId: string, role: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(404, 'Property listing not found');
  }

  if (role !== 'ADMIN' && property.landlordId !== landlordId) {
    throw new AppError(403, 'Forbidden. You do not own this property listing.');
  }

  const result = await prisma.property.delete({
    where: { id: propertyId },
  });

  return result;
};

export const PropertyService = {
  createPropertyInDB,
  getAllPropertiesFromDB,
  getPropertyByIdFromDB,
  updatePropertyInDB,
  deletePropertyFromDB,
};