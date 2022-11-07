import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import sharp from "sharp";
import PostService from "../Services/Post.service";

export default class PostController {
  declare db: Sequelize;
  declare service: PostService;
  constructor(db: Sequelize) {
    this.db = db;
    this.service = new PostService(db);
  }

  getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service.getAll().then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var files = req.files as Express.Multer.File[];
      // console.log(!files);

      let createResult;
      if (!files) {
        createResult = await this.service.create(req.body);
      } else {
        createResult = await this.service.createWithImages(req.body, files);
      }

      return res.send(createResult);
    } catch (e) {
      return next(e);
    }
  };

  likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let pID = req.params.pid;
      let uID = req.body.user;
      return await this.service.likePost(pID, uID).then((result) => {
        return res.send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postID = req.params.pid;
      const username = req.body.user;
      const comment = req.body.comment;
      
      return await this.service
        .createComment(postID, username, comment)
        .then((result) => {
          res.send(result);
        });
    } catch (e) {
      return next(e);
    }
  };
}
