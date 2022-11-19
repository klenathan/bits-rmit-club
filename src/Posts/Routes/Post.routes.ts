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
      .post("/", upload.any(), this.controller.create)
      .post("/like/:pid", this.controller.likePost)
      .post("/comment/:pid", this.controller.createComment)
      .delete("/removelike/:pid", this.controller.removeLikePost)
      .get("/feed/:uid", this.controller.getFeed)
      .get("/clubfeed/:id", this.controller.getClubFeed)
      .get("/:id", this.controller.getByPk)
      // .get("/authCheck", async (req, res, next: NextFunction) => {
      //   try {
      //       return await this.service.authorizationCheck(
      //           req.body.username,
      //           req.body.club
      //         ).then(result => {
      //             return res.send(result)
      //         })
      //   } catch (error) {
      //       return next(error)
      //   }
      // });
  }
}
