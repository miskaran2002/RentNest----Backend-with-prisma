import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

const createReview = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const tenantId = req.user.userId;
  const result = await ReviewService.createReviewInDB(tenantId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const result = await ReviewService.getPropertyReviewsFromDB(propertyId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property reviews retrieved successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getPropertyReviews,
};