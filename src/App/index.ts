import Server from "./server";
import db from "./Models";
import multer from "multer";

import Irouter from "../Base/Types/routerInterface";
import MailRouter from "../Email/mail.routes";
import AuthPackage from "../Auth";
import PostPackage from "../Posts";

// Auth
import { User } from "../Auth/Models/User.model";
import { UserValidator } from "../Auth/Models/Validation.model";
// Clubs
import ClubPackage from "../Clubs";
import { ClubUser } from "../Clubs/Models/ClubUser.model";
import { Club } from "../Clubs/Models/Club.model";
// Posts
import { Post } from "../Posts/Models/Post.model";
import { PostComment } from "../Posts/Models/Comment.model";
import { PostLike } from "../Posts/Models/PostLike.model";
import { ClubEvent } from "../Posts/Models/Event.model";

import ImgRouter from "../ImageProcess/Image.routes";

// Notifications
import { Notification } from "../Notification/Notification.model";
import { UserNoti } from "../Notification/UserNoti.model";
import { NextFunction, Request, RequestHandler, Response } from "express";

const PORT = 8080;

db.addModels([
  User,
  Post,
  Club,
  ClubUser,
  PostLike,
  PostComment,
  UserValidator,
  Notification,
  UserNoti,
  ClubEvent,
]);

const auth = new AuthPackage(db);
const post = new PostPackage(db);
const club = new ClubPackage(db);


// Init Formdata parser
const upload = multer();
// formdata loggin 
// const formDataLogger = (req: Request, res: Response, next: NextFunction) => {
//   if (req.body) {
//     console.log("RequestBody", req.body);
//   }
//   return next()
// }


const routerObj: Irouter = {
  routers: [
    {
      prefix: "/mail",
      instance: new MailRouter(db).router,
      middlewares: upload.any(),
    },
    { prefix: "/auth", instance: auth.router, middlewares: upload.any() },
    { prefix: "/post", instance: post.router, middlewares: upload.any() },
    { prefix: "/club", instance: club.router, middlewares: upload.any() },
    {
      prefix: "/image",
      instance: new ImgRouter(db).routes,
      middlewares: upload.any(),
    },
  ],
};
const server = new Server(PORT, db, routerObj);

db.sync({
  // force: true
  // alter: true
}).then(() => {
  console.log(db.models);
  server.start();
});
