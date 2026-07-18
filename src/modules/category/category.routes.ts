import express from 'express';
import { CategoryValidation } from './category.validation';
import auth from '../../mddlewires/auth.middleware';
import validateRequest from '../../mddlewires/validateRequest';
import { CategoryController } from './categoty.controller';

const router = express.Router();


router.get(
  '/',
  CategoryController.getAllCategories
);


router.post(
  '/',
  auth('ADMIN'),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory
);

router.delete(
  '/:id',
  auth('ADMIN'),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;