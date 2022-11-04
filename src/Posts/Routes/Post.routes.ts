import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import PostController from "../Controllers/Post.controller";

export default class PostRouter {
  declare routes: Router;
    declare controller: PostController;
  constructor(db: Sequelize) {
    this.routes = Router();
    this.controller = new PostController(db)
    this.routes.get("/", this.controller.getAllPost)
    .post("/", this.controller.create)
  }
}
