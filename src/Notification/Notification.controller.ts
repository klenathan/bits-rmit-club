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
    // console.log(req.body);
    try {
      const username = req.params.id;
      const content = req.body.content;
      const image = req.body.image ?? null;
      return await this.services.newNoti(username, content, image).then((r) => {
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
