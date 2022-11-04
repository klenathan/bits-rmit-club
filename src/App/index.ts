import Server from "./server";
import db from "./Models";
// import Auth from "../Auth";
import * as crypto from "crypto";

import Irouter from "../Base/Types/routerInterface";
import MailRouter from "../Email/mail.routes";
import AuthPackage from "../Auth";
import PostPackage from "../Posts";

import { User } from "../Auth/Models/User.model";
import { Post } from "../Posts/Models/Post.model";

const PORT = 8080;

db.addModels([User, Post]);

const auth = new AuthPackage(db);
const post = new PostPackage(db);

const routerObj: Irouter = {
  routers: [
    // {
    //   prefix: "/product",
    //   middlewares: [verifyToken("access"), verifyUserRole("Admin")],
    //   instance: sale.productRouter,
    // }
    { prefix: "/mail", instance: new MailRouter(db).router },
    { prefix: "/auth", instance: auth.router },
    { prefix: "/post", instance: post.router },
  ],
};
const server = new Server(PORT, db, routerObj);

db.sync().then(() => {
  console.log(db.models);
  server.start();
});
