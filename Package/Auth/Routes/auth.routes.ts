import AuthController from "../Controllers/auth.controller";
import Express, { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import { verifyToken } from "./../Middlewares/verifyToken";

export default class AuthRoutes {
  public router: Router;
  public controller: AuthController;
  constructor(db: Sequelize) {
    this.controller = new AuthController(db);
    this.router = Express.Router();
    this.router.post("/login", this.controller.signIn);
    this.router.get("/test", verifyToken("access"), this.controller.test);
    this.router.post(
      "/refresh",
      verifyToken("refresh"),
      this.controller.refreshToken
    );
  }
}
