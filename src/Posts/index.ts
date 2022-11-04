import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import { Post } from "./Models/Post.model";
import PostRouter from "./Routes/Post.routes";

export default class PostPackage {
  declare router: Router;
  constructor(db: Sequelize) {
    
    this.router = new PostRouter(db).routes;
  }
}
