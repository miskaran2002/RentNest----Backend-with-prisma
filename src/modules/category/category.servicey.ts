import { prisma } from '../../lib/prisma';
import AppError from '../../utilities/AppError';


const createCategoryInDB = async (payload: { name: string; description?: string }) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name: payload.name },
  });

  if (existingCategory) {
    throw new AppError(400, 'A category with this name already exists');
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return result;
};

const updateCategoryInDB = async (id: string, payload: { name?: string; description?: string }) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  if (payload.name) {
    const duplicateCategory = await prisma.category.findUnique({
      where: { name: payload.name },
    });

    if (duplicateCategory && duplicateCategory.id !== id) {
      throw new AppError(400, 'Another category with this name already exists');
    }
  }

  const result = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  const linkedProperty = await prisma.property.findFirst({
    where: { categoryId: id },
  });

  if (linkedProperty) {
    throw new AppError(
      400,
      'Cannot delete category. There are active property listings under this category.'
    );
  }

  const result = await prisma.category.delete({
    where: { id },
  });

  return result;
};

export const CategoryService = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};