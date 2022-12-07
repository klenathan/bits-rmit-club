import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import sharp from "sharp";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import PostService from "../Services/Post.service";

export default class PostController {
  declare db: Sequelize;
  declare service: PostService;
  constructor(db: Sequelize) {
    this.db = db;
    this.service = new PostService(db);
  }

  getClubFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service.getClubFeed(req.params.id).then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service
        .getFeedForUser(req.params.uid)
        .then((result) => {
          return res.send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  getAllPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service.getAll().then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  getByPk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id = req.params.id;
      return await this.service.getByPk(id).then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var files = req.files as Express.Multer.File[];
      await this.service.authorizationCheck(req.body.user, req.body.author);
      let createResult;

      // console.log("files", files);

      // console.log('body', req.body);

      if (!files) {
        createResult = await this.service.create(req.body);
      } else {
        createResult = await this.service.createWithImages(req.body, files);
      }

      // createResult = {mes: "hello"}

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

  removeLikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let pID = req.params.pid;
      let uID = req.body.user;
      return await this.service.removeLikePost(pID, uID).then((result) => {
        console.log(result);

        return res
          .status(200)
          .send({ message: `Removed ${uID}'s like on post ${pID}` });
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

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.user) {
        return next(new CustomError("INVALID_INFO", 400, "Invalid username"));
      }
      return await this.service
        .deletePost(req.body.user, req.params.id)
        .then((result) => {
          return res.status(200).send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  getAllEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service.getAllEvent().then((r) => {
        return res.status(200).send(r);
      });
    } catch (e) {
      return next(e);
    }
  };

  createNewEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var files = req.files as Express.Multer.File[];
      await this.service.authorizationCheck(req.body.user, req.body.author);
      let createResult;

      if (!files) {
        // createResult = await this.service.createEvent(req.body);
        return next(
          new CustomError(
            "NO_IMG_FOUND",
            400,
            "Please include image on create new event"
          )
        );
      } else {
        createResult = await this.service.createEventWithImages(
          req.body,
          files
        );
      }

      return res.send(createResult);
    } catch (e) {
      return next(e);
    }
  };

  updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service
        .updateEvent(req.params.id, req.body)
        .then((r) => {
          return res.status(200).send({ success: `updated ${r} events` });
        });
    } catch (e) {
      return next(e);
    }
  };

  getClubImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service.getClubImages("456", 10).then((r) => {
        return res.send({images: r})
      });
    } catch (e) {
      return next(e);
    }
  };
}
