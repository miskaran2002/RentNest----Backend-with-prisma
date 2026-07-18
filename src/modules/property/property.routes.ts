import express from 'express';
import { PropertyController } from './property.controller';
import { PropertyValidation } from './property.validation';
import auth from '../../mddlewires/auth.middleware';
import validateRequest from '../../mddlewires/validateRequest';

const router = express.Router();


router.get(
  '/',
  PropertyController.getAllProperties
);

router.get(
  '/:id',
  PropertyController.getPropertyById
);


router.post(
  '/',
  auth('LANDLORD'),
  validateRequest(PropertyValidation.createPropertyZodSchema),
  PropertyController.createProperty
);

router.patch(
  '/:id',
  auth('LANDLORD', 'ADMIN'),
  validateRequest(PropertyValidation.updatePropertyZodSchema),
  PropertyController.updateProperty
);

router.delete(
  '/:id',
  auth('LANDLORD', 'ADMIN'),
  PropertyController.deleteProperty
);

export const PropertyRoutes = router;