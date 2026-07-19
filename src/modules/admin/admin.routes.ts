import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../mddlewires/auth.middleware';

const router = express.Router();


router.get(
  '/properties',
  auth('ADMIN'),
  AdminController.getAllProperties
);


router.get(
  '/rentals',
  auth('ADMIN'),
  AdminController.getAllRentalRequests
);


router.get(
  '/overview',
  auth('ADMIN'),
//   AdminController.getPlatformOverview
);

export const AdminRoutes = router;