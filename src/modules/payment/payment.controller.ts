import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import catchAsync from '../../utilities/catchAsync';
import sendResponse from '../../utilities/sendResponse';

const createPaymentSession = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const tenantId = req.user.userId;
  const { rentalRequestId } = req.body;
  const result = await PaymentService.createCheckoutSession(tenantId, rentalRequestId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Stripe payment checkout session created successfully',
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const result = await PaymentService.handleWebhookInDB(signature, req.body);

  res.status(200).json(result);
});

const getMyPayments = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { userId, role } = req.user;
  const result = await PaymentService.getMyPaymentsFromDB(userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment transaction history retrieved successfully',
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const result = await PaymentService.getPaymentByIdFromDB(id as string, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment transaction details retrieved successfully',
    data: result,
  });
});

export const PaymentController = {
  createPaymentSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};