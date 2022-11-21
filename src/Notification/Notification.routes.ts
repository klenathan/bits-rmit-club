import { NextFunction, Router } from "express";
import { Sequelize } from "sequelize-typescript";
import WS from "../WebSocket";
import NotiController from "./Notification.controller";

export default class NotiRouter {
  declare routes: Router;
  declare controller: NotiController;

  constructor(db: Sequelize, ws: WS) {
    this.routes = Router();
    this.controller = new NotiController(db, ws);
    this.routes.get("/:id", this.controller.getNotiForUser);
    this.routes.post("/:id", this.controller.newNoti);
  }
}
