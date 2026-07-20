import { NextFunction, Request, Response } from "express";

import AppError from "../utilities/AppError";
import { Prisma } from "../../generated/prisma/client";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    errorDetails: null,
  });
};

export const globalErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: unknown = null;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorDetails = error.errorDetails;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (error.code === "P2002") {
      message = `Duplicate value for: ${(error.meta?.target as string[])?.join(", ")}`;
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "The requested record was not found";
    } else {
      message = "Database request error";
      console.error("REAL ERROR:", error);

    }
    errorDetails = process.env.NODE_ENV === "development" ? error.message : null;
  } else if (error instanceof Error) {
    message = error.message;
    errorDetails = process.env.NODE_ENV === "development" ? error.stack : null;
  }

  res.status(statusCode).json({ success: false, message, errorDetails });
};