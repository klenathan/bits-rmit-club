import {
  Express,
  Application,
  Router,
  NextFunction,
  Request,
  Response,
} from "express";
import { Sequelize } from "sequelize-typescript";
import UserService from "./../Services/User.service";

export default class UserController {
  public UserService: UserService;
  constructor(db: Sequelize) {
    this.UserService = new UserService(db);
  }

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = req.body;
      const newUser = await this.UserService.create(payload);
      return res.status(200).send(newUser);
    } catch (error) {
      return next(error);
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.UserService.getAll();
      return res.status(200).send(users);
    } catch (error) {
      return next(error);
    }
  };

  public findUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.UserService.getOne(req.params.username);
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = req.body;
      const updatedUser = await this.UserService.update(
        req.params.username,
        payload
      );
      return res.status(200).send(updatedUser);
    } catch (error) {
      return next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const deletedUser = await this.UserService.deleteByPK(
        req.params.username
      );

      return res.status(200).send({
        message: "DELETE_SUCCESS",
        deleted: req.params.username,
      });
    } catch (error) {
      return next(error);
    }
  };
}
