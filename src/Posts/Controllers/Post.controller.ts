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

      let createResult;
      if (files.length > 0) {
        createResult = await this.service.createWithImages(req.body, files);
      } else {
        createResult = await this.service.create(req.body);
      }

      return res.send(createResult);
    } catch (e) {
      return next(e);
    }
  };
}
