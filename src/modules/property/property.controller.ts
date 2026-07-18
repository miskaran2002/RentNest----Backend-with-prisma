import { Request, Response } from 'express';
import { PropertyService } from './property.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

const createProperty = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const landlordId = req.user.userId;
  const result = await PropertyService.createPropertyInDB(landlordId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Property listing created successfully',
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await PropertyService.getAllPropertiesFromDB(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    data: result,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PropertyService.getPropertyByIdFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property details retrieved successfully',
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const result = await PropertyService.updatePropertyInDB(id as string, userId, role, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  await PropertyService.deletePropertyFromDB(id as string, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property deleted successfully',
    data: null,
  });
});

export const PropertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};