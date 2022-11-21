import { Sequelize } from "sequelize-typescript";
import WS from "../WebSocket";
import CustomError from "../App/Middlewares/Errors/CustomError";

import { User } from "../Auth/Models/User.model";
import { Notification as Noti } from "./Notification.model";
import { UserNoti } from "./UserNoti.model";

export default class NotiService {
  declare db: Sequelize;
  declare ws: WS;
  constructor(db: Sequelize, ws: WS) {
    this.db = db;
    this.ws = ws;
  }

  newNoti = async (username: string, content: string, img?: string) => {
    const notiPackage = {
      image: img ?? null,
      content: content,
    };
    let user = await User.findByPk(username, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      throw new CustomError("null user", 400, `${"admin"} is null`);
    }
    let noti = await Noti.create(notiPackage, { include: [User] })
      .then((r) => {
        this.ws.notification(username, r);
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
    noti.$add("notiTo", user);
    return noti;
  };

  getNotiForUser = async (userid: string) => {
    return await Noti.findAll({
      include: [
        {
          model: User,
          required: true,
          where: { username: userid },
          attributes: ["username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    }).then((r) => {
      return r;
    });
  };
}
