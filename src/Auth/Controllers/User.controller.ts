import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import { User } from "../Models/User.model";
import AuthService from "../Services/auth.service";

export default class AuthController {
  declare services: AuthService;

  constructor(db: Sequelize) {
    this.services = new AuthService(db);
  }

  getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return this.services.getAll().then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.services.getUserInfo(req.params.id).then((result) => {
        return res.status(200).send(result);
      });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username = req.body.username;
      let password = req.body.password;

      return await this.services
        .login(username, password)
        .then((result) => {
          return res.status(200).send(result);
        })
        .catch((e) => {
          return next(e);
        });
    } catch (e) {
      return next(e);
    }
  };

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let files = req.files as Express.Multer.File[];
      let payload: Partial<User> = req.body;
      let regex = new RegExp("s[0-9]+@rmit.edu.vn");
      if (payload.email) {
        if (!regex.test(payload.email)) {
          return res.status(400).send({
            name: `INVALID_EMAIL`,
            message: `${payload.email} is invalid, email must be RMIT education email`,
          });
        }
      }
      // console.log("files:", files[0].originalname);
      
      return await this.services.signUp(payload, files).then((result) => {
        res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.services
        .validateUser(req.body.username, req.body.key)
        .then((result) => {
          return res.send({ success: result });
        });
    } catch (e) {
      return next(e);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username;
      let payload = req.body;
      return this.services.updateUser(username, payload).then((result) => {
        return res.status(200).send({
          message: `Successfully update user data | ${result} users updated`,
        });
      });
    } catch (error) {
      return next(error);
    }
  };
}
