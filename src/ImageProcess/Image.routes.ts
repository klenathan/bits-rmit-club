import { Router } from "express";
import multer from "multer";
import path from "path";
import { Sequelize } from "sequelize-typescript";

const upload = multer()

export default class ImgRouter {
  declare routes: Router;
    // declare controller: PostController;
  constructor(db: Sequelize) {
    this.routes = Router();
    // this.controller = new PostController(db)
    this.routes.get("/:img", async (req, res) => {
        
        res.sendFile(path.join(__dirname, '/../../Images/', req.params.img));
        // res.send())
    })
    this.routes.get("/const/:img", async (req, res) => {
        
      res.sendFile(path.join(__dirname, '/img/', req.params.img));
      // res.send(path.join(__dirname, '/img/', req.params.img))
  })
  }
}
