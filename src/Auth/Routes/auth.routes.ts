import { Router } from "express";
import multer from "multer";
import { Sequelize } from "sequelize-typescript";
import AuthController from "../Controllers/User.controller";

import NotiController from "../../Notification/Notification.controller";

const upload = multer();

export default class AuthRouter {
  declare routes: Router;
  declare controller: AuthController;

  constructor(db: Sequelize) {
    this.routes = Router();
    this.controller = new AuthController(db);

    this.routes
      .post("/login", this.controller.login)
      .get("/", this.controller.getAllUser)
      .post("/verify", this.controller.validateUser)
      .post("/signup", upload.any(), this.controller.signUp)
      .put("/:username", upload.any(), this.controller.updateUser)
      .get("/:id", this.controller.getUserInfo);
  }
}
