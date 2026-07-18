import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

const getMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.getMyProfileFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.updateMyProfileInDB(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All users retrieved successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBanned } = req.body;
  const result = await UserService.updateUserStatusInDB(id as string, isBanned);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User account has been successfully ${isBanned ? 'Banned' : 'Unbanned'}`,
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserStatus,
};