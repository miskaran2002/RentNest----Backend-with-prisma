import express from 'express';
import { RentalController } from './rental.controller';
import { RentalValidation } from './rental.validation';
import auth from '../../mddlewires/auth.middleware';
import validateRequest from '../../mddlewires/validateRequest';

const router = express.Router();

// Get all rental requests
router.post(
  '/',
  auth('TENANT'),
  validateRequest(RentalValidation.createRentalRequestZodSchema),
  RentalController.createRentalRequest
);

router.get(
  '/',
  auth('TENANT', 'LANDLORD', 'ADMIN'),
  RentalController.getAllRentalRequests
);

router.get(
  '/:id',
  auth('TENANT', 'LANDLORD', 'ADMIN'),
  RentalController.getRentalRequestById
);

// Update rental request status
router.patch(
  '/:id/status',
  auth('LANDLORD', 'ADMIN'),
  validateRequest(RentalValidation.updateRentalRequestStatusZodSchema),
  RentalController.updateRentalRequestStatus
);

export const RentalRoutes = router;