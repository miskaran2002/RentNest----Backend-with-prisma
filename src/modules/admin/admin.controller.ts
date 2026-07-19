import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllPropertiesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All platform properties retrieved successfully',
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllRentalRequestsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All platform rental requests retrieved successfully',
    data: result,
  });
});

const getPlatformOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getPlatformOverviewFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Platform overview statistics retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  getAllProperties,
  getAllRentalRequests,
  getPlatformOverview,
};