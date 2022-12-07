import { NextFunction, Router } from "express";
import multer from "multer";
import { Sequelize } from "sequelize-typescript";
import PostController from "../Controllers/Post.controller";
import PostService from "../Services/Post.service";

const upload = multer();

export default class PostRouter {
  declare routes: Router;
  declare controller: PostController;

  declare service: PostService;
  constructor(db: Sequelize) {
    this.routes = Router();
    this.controller = new PostController(db);
    this.service = new PostService(db);

    this.routes
      .get("/", this.controller.getAllPost)
      .post("/event", upload.any(), this.controller.createNewEvent)
      .get("/event", this.controller.getAllEvent)
      .put("/event/:id", this.controller.updateEvent)
      .post("/", upload.any(), this.controller.create)
      .post("/like/:pid", this.controller.likePost)
      .post("/comment/:pid", this.controller.createComment)
      .delete("/removelike/:pid", this.controller.removeLikePost)
      .get("/feed/:uid", this.controller.getFeed)
      .get("/clubfeed/:id", this.controller.getClubFeed)
      .get("/clubimage/:id", this.controller.getClubImages)
      .get("/:id", this.controller.getByPk)
      .delete("/:id", this.controller.deletePost);
  }
}
