import express from 'express';

import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import auth from '../../mddlewires/auth.middleware';
import validateRequest from '../../mddlewires/validateRequest';

const router = express.Router();


router.get(
  '/profile',
  auth('TENANT', 'LANDLORD', 'ADMIN'),
  UserController.getMyProfile
);

router.patch(
  '/updateProfile',
  auth('TENANT', 'LANDLORD', 'ADMIN'),
  validateRequest(UserValidation.updateUserProfileZodSchema),
  UserController.updateMyProfile
);


router.get(
  '/admin/users',
  auth('ADMIN'),
  UserController.getAllUsers
);

router.patch(
  '/admin/users/:id',
  auth('ADMIN'),
  validateRequest(UserValidation.updateUserStatusZodSchema),
  UserController.updateUserStatus
);

export const UserRoutes = router;