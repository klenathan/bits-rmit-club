import CustomError from "./../Errors/CustomError";
import { Response, NextFunction } from "express";
import { Request } from "express-jwt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { extractTokenFromHeader } from "./../Utils/ExtractToken";
dotenv.config();

/**
 * Middleware for verify all token generated when login, to use this, pass it before the route that need to protected
 * @param type - The type of token that need to verify.
 *
 */
export const verifyToken =
  (type: "access" | "refresh") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = extractTokenFromHeader(req.headers.authorization);
      jwt.verify(
        accessToken,
        process.env.APP_SECRET as string,
        {
          complete: true,
        },
        function (err: any, decoded: any) {
          if (err) {
            throw new CustomError("TOKEN_VALIDATION_FAIL", 401, err.message);
          }
          if (decoded.payload.sub !== type)
            throw new CustomError(
              "TOKEN_VALIDATION_FAIL",
              401,
              "Wrong Token Type"
            );
          req.auth = decoded.payload;
        }
      );
      return next();
    } catch (error) {
      return next(error);
    }
  };
