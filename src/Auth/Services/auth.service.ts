import { Sequelize } from "sequelize-typescript";
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import BaseService from "../../Base/base.service";
import { User } from "../Models/User.model";
import * as crypto from "crypto";

export default class AuthService extends BaseService<User> {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    super(new User());
    this.db = db;
  }

  getAll = async (): Promise<User[]> => {
    return await User.findAll().catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  login = async (
    username: string,
    password: string
  ): Promise<Partial<User>> => {
    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    password = hashPassword;

    return await User.findByPk(username).then((result) => {
      let newRes: any;

      
      
      if (result?.password == password) {
        newRes = result?.toJSON()
        delete newRes.password
        
        return newRes;
      } else {
        throw new CustomError(
          "WRONG_CREDENTIAL",
          404,
          "Username or password is incorrect"
        );
      }
    });
  };

  signUp = async (payload: Partial<User>): Promise<User> => {
    if (payload.password) {
      let password: string = payload.password;
      const hashPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      payload.password = hashPassword;

      return await User.create(payload).catch((e) => {
        if (e.name == "SequelizeUniqueConstraintError") {
          throw new CustomError(e.name, 400, "User already existed");
        }
        throw new CustomError(e.name, 400, e.message);
      });
    } else {
      throw new CustomError(
        "PASSWORD_DOES_NOT_EXIST_ON_PAYLOAD",
        400,
        "password is missing from payload"
      );
    }
  };

  updateUser = async (
    username: string,
    payload: Partial<User>
  ): Promise<User[] | any> => {
    const result = await User.update(payload, {
      where: { username: username },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    if (result[0] == 0) {
      throw new NotFoundError(
        "USER_NOT_FOUND",
        `Unable to find user ${username}`
      );
    }

    return result;
  };
}
