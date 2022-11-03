import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import AuthController from "../Controllers/User.controller";

export default class AuthRouter {
  declare routes: Router;
  declare controller: AuthController;

  constructor(db: Sequelize) {
    this.routes = Router()
    this.controller = new AuthController(db)
    this.routes.post("/login", this.controller.login)
    .post("/signup", this.controller.signUp)
    .get("/getAll",  this.controller.getAllUser) 
  }
}
