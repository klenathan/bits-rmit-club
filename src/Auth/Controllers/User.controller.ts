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

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username = req.body.username;
      let password = req.body.password;

      return await this.services.login(username, password).then((result) => {
        return res.status(200).send(result);
      }).catch(e => {
        return next(e)
      });
    } catch (e) {
      return next(e);
    }
  };

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload: Partial<User> = req.body;

      return await this.services.signUp(payload).then((result) => {
        res.status(200).send(result);
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.username;
      let payload = req.body;
      return this.services.updateUser(username, payload).then((result) => {
        return res
          .status(200)
          .send({message: `Successfully update user data | ${result} users updated`});
      });
    } catch (error) {
      return next(error);
    }
  };
}
