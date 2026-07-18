import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import AppError from "../utilities/AppError";

const validateRequest = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return next(new AppError(400, "Validation failed", errorDetails));
      }
      next(error);
    }
  };
};

export default validateRequest;