import Server from "./server";
import db from "./Models";

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
  ClubEvent
]);

const auth = new AuthPackage(db);
const post = new PostPackage(db);
const club = new ClubPackage(db);


const routerObj: Irouter = {
  routers: [
    { prefix: "/mail", instance: new MailRouter(db).router },
    { prefix: "/auth", instance: auth.router },
    { prefix: "/post", instance: post.router },
    { prefix: "/club", instance: club.router },
    { prefix: "/image", instance: new ImgRouter(db).routes },
  ],
};
const server = new Server(PORT, db, routerObj);

db.sync({
  force: true
  // alter: true 
}).then(() => {
  console.log(db.models);
  server.start();
});
