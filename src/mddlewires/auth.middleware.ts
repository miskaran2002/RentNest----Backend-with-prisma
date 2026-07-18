import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";

import config from "../config";
import AppError from "../utilities/AppError";
import { jwtHelpers } from "../utilities/jwtHelpers";
import { Role } from "../../generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: Role;
      };
    }
  }
}

const auth = (...requiredRoles: Role[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(401, "You are not authorized. Access token missing.");
      }

      const token = authHeader.split(" ")[1];

      let verifiedUser;
      try {
        verifiedUser = jwtHelpers.verifyToken(token as string, config.jwt_access_secret as Secret);
      } catch (err) {
        throw new AppError(401, "Invalid or expired access token.");
      }

      req.user = verifiedUser as { userId: string; email: string; role: Role };

      if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
        throw new AppError(403, "Forbidden. You do not have access to this resource.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;