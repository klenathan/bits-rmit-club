import { Model } from "sequelize";
import { User } from "./../Models";
import BaseService from "./base.service";
import NotFoundError from "./../Errors/NotFoundError";
import { PassWordUtils } from "./Auth.service";
import { Sequelize } from "sequelize-typescript";

export default class UserService extends BaseService<User> {
  constructor(db: Sequelize) {
    super(new User());
  }
  async create(payload: Partial<User>): Promise<any> {
    const passWordUtils = new PassWordUtils();

    payload.password = await passWordUtils.hashPW(payload.password!);
    const newUser = await User.create(payload);
    return newUser;
  }

  async getOne(pk: string): Promise<User> {
    const user = await User.findByPk(pk);
    if (!user)
      throw new NotFoundError(
        `USER_NOT_FOUND`,
        "User was not found on the database"
      );
    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await User.findAll();
    return users;
  }

  async update(username: string, payload: Partial<User>): Promise<any> {
    const user = await User.findByPk(username);
    if (!user)
      throw new NotFoundError(
        `USER_NOT_FOUND`,
        "User was not found on the database"
      );
    if (payload.password) {
      const passWordUtils = new PassWordUtils();
      payload.password = await passWordUtils.hashPW(payload.password);
    }
    const updatedUser = await user.update(payload);

    return updatedUser;
  }

  async deleteByPK(pk: string): Promise<any> {
    const userToDelete = await User.findByPk(pk);
    if (!userToDelete)
      throw new NotFoundError(
        `USER_NOT_FOUND`,
        "User was not found on the database"
      );
    return await userToDelete.destroy();
  }
}
