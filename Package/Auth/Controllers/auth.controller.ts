import { NextFunction, Request, Response } from "express";
import { Request as AuthRequest } from "express-jwt";
import { Sequelize } from "sequelize-typescript";
import { UserSigninDTO } from "./../validators/Auth.dto";
import Authentication, { AuthOptions } from "../Services/Auth.service";
import RequestBodyValidator from "../validators/validator";
import { extractTokenFromHeader } from "./../Utils/ExtractToken";
import RefreshTokenService from "./../Services/Token.service";
import { signNewToken } from "./../Utils/SignNewToken";
const validator = new RequestBodyValidator();
export default class AuthController {
  public db: Sequelize;
  public authService: Authentication;
  public rfTokenService: RefreshTokenService;
  constructor(db: Sequelize) {
    this.db = db;
    this.authService = new Authentication(AuthOptions.getAuthOptions(), db);
    this.rfTokenService = new RefreshTokenService(db);
  }

  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: UserSigninDTO = req.body;
      await validator.validateRequest(UserSigninDTO, payload, true);
      const result = await this.authService.signIn(payload);
      return res.status(200).send(result);
    } catch (error) {
      return next(error);
    }
  };

  // public signOut = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const
  //   } catch (error) {
  //     return next(error)
  //   }
  // }

  public refreshToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const refreshToken = extractTokenFromHeader(req.headers.authorization);
      const isRFTokenValid = await this.rfTokenService.compareToken(
        refreshToken
      );
      if (isRFTokenValid) {
        const accessToken = await signNewToken(
          { username: req.auth?.username, role: req.auth?.role },
          {
            issuer: "SKDV68.com",
            audience: "locphatskdv",
            tokenType: "access",
            expiresIn: 120,
            algorithms: "HS256",
          }
        );
        return res.status(200).send({
          message: "REFRESH_SUCCESS",
          payload: {
            username: req.auth?.username,
            role: req.auth?.role,
            accessToken,
          },
        });
      }
    } catch (error) {
      return next(error);
    }
  };

  public test = async (req: any, res: Response, next: NextFunction) => {
    try {
      const authPayload = req.auth;
      return res.status(200).send(authPayload);
    } catch (error) {
      return next(error);
    }
  };
}
