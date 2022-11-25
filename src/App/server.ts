import express, {
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from "express";
import https from "https";
import http, { createServer } from "http";
import * as socketio from "socket.io";
import cors from "cors";
import { isThisTypeNode, textChangeRangeIsUnchanged } from "typescript";

// Custom Packages
import * as handlers from "./Middlewares/Errors/handlers";
import MainRouter from "./Routes";
import { Sequelize } from "sequelize-typescript";
import Irouter from "../Base/Types/routerInterface";
import path from "path";
import WS from "../WebSocket";

import NotiRouter from "../Notification/Notification.routes";

export default class Server {
  public instance: Application;
  private server: any;
  public PORT: number;
  declare db: Sequelize;
  public options: any;
  // private io: socketio.Server;
  private webSocket: WS;
  private httpServer: http.Server;
  private routerObj: Irouter;

  // private noti: NotiRouter;

  public constructor(PORT: number, db: Sequelize, routerObj: Irouter) {
    this.instance = express();
    this.db = db;
    this.PORT = PORT;
    this.routerObj = routerObj;
    this.httpServer = createServer(this.instance);
    this.webSocket = new WS(this.httpServer);

    // Construct methods
    this.middleware();
    this.webSocket.test();
    this.routing();
    this.errorHandlers();
  }

  public start() {
    this.httpServer.listen(this.PORT, () => {
      console.info("PORT is " + this.PORT);
    });
  }

  private middleware() {
    // CORS
    this.instance.use(cors());

    // JSON body parser
    this.instance.use(express.json());
    this.instance.use(express.urlencoded({ extended: true }));
  }

  // Routers
  private routing() {
    const router = new MainRouter(this.db);
    router.register(this.instance);

    this.instance.use("/noti", new NotiRouter(this.db, this.webSocket).routes);

    for (let route of this.routerObj.routers) {
      if (route.middlewares)
        this.instance.use(
          route.prefix,
          this.logMiddleware,
          route.middlewares,
          route.instance
        );
      else this.instance.use(route.prefix, this.logMiddleware, route.instance);
    }

    this.instance.get("/", (req, res) => {
      res.sendFile(__dirname + "/Static/index.html");
    });

    this.instance.get("/*", (req, res) => {
      res.status(200).sendFile(__dirname + "/Static/404.html");
    });
  }

  // Error middlewares (must be after all routers)
  private errorHandlers() {
    this.instance.use(handlers.handleError);
    this.instance.use(handlers.invalidPathHandler);
  }

  private logMiddleware(req: Request, res: Response, next: NextFunction) {
    // console.log(req.baseUrl);

    if (req.baseUrl != "/image")
      console.log(req.method, req.baseUrl, req.url, req.body);
    return next();
  }
}
