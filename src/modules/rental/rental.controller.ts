import { Request, Response } from 'express';
import { RentalService } from './rental.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

const createRentalRequest = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const tenantId = req.user.userId;
  const result = await RentalService.createRentalRequestInDB(tenantId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Rental request submitted successfully',
    data: result,
  });
});

const getAllRentalRequests = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { userId, role } = req.user;
  const result = await RentalService.getAllRentalRequestsFromDB(userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental requests retrieved successfully',
    data: result,
  });
});

const getRentalRequestById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const result = await RentalService.getRentalRequestByIdFromDB(id as string, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Rental request details retrieved successfully',
    data: result,
  });
});

const updateRentalRequestStatus = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const { status } = req.body;
  const result = await RentalService.updateRentalRequestStatusInDB(id as string, userId, role, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Rental request status has been updated to ${status} successfully`,
    data: result,
  });
});

export const RentalController = {
  createRentalRequest,
  getAllRentalRequests,
  getRentalRequestById,
  updateRentalRequestStatus,
};