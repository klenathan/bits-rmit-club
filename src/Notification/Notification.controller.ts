import { Request, Response, NextFunction } from "express";
import { Sequelize } from "sequelize-typescript";
import WS from "../WebSocket";
import NotiService from "./Notification.service";

export default class NotiController {
  declare services: NotiService;

  constructor(db: Sequelize, ws: WS) {
    this.services = new NotiService(db, ws);
  }

  newNoti = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.params.id;
      const content = req.body.content;
      const image = req.body.image ?? null;
      const type = req.body.type ?? null;
      const target = req.body.target ?? null;
      return await this.services
        .newNoti(username, type, content, target, image)
        .then((r) => {
          res.send(r);
        });
    } catch (e) {
      return next(e);
    }
  };

  getNotiForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let username = req.params.id;
      return await this.services.getNotiForUser(username).then((r) => {
        return res.send(r);
      });
    } catch (e) {
      return next(e);
    }
  };
}
