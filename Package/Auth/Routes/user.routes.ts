import Express, { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import UserController from "./../Controllers/user.controller";

export default class UserRoutes {
  public router: Router;
  public controller: UserController;
  constructor(db: Sequelize) {
    this.controller = new UserController(db);
    this.router = Express.Router();
    this.router.get("/:username", this.controller.findUser);
    this.router.get("/", this.controller.getAllUsers);
    this.router.post("/", this.controller.createUser);
    this.router.put("/:username", this.controller.updateUser);
    this.router.delete("/:username", this.controller.deleteUser);
  }
}
