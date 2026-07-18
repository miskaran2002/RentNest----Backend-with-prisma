import { Request, Response } from "express";
import catchAsync from "../../utilities/catchAsync";
import sendResponse from "../../utilities/sendResponse";
import { AuthService } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);
  sendResponse(res, { statusCode: 201, success: true, message: "User registered successfully", data: result });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Logged in successfully", data: result });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user!.userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Profile retrieved successfully", data: result });
});

export const AuthController = { register, login, getMe };