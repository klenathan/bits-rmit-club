import CustomError from "./../Errors/CustomError";
import { Request } from "express-jwt";
import { NextFunction, Response } from "express";

export const verifyUserRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authPayload = req.auth;
      if (req.auth?.role === role) {
        return next();
      }
      return next(
        new CustomError(
          "INVALID_PERMISSION",
          403,
          "You dont have permission to perform this action"
        )
      );
    } catch (error) {
      return next(error);
    }
  };
};
