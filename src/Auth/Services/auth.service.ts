import { Sequelize } from "sequelize-typescript";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import BaseService from "../../Base/base.service";
import { User } from "../Models/User.model";

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

  login = async (username: string, password: string): Promise<User> => {
    return await User.findByPk(username).then((result) => {
      if (result?.password == password) {
        return result;
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
    let result: User;
    result = await User.create(payload).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    return result;
  };
}
