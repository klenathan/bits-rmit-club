import ProductController, * as controller from "../Controller/product.controller";
import { Express, Request, Router } from "express";
import multer from "multer";
import { Multer } from "multer";
import { Sequelize } from "sequelize-typescript";
import sharp from "sharp";
import { handleInputImage } from "../../Base/Utils/imageHandling";

const upload = multer();
export default class ProductRouter {
  declare router: Router;
  declare controller: ProductController;

  constructor(db: Sequelize) {
    this.controller = new ProductController(db);
    this.router = Router();
    // declare routes
    this.router.post("/", upload.any(), this.controller.create);
    this.router.post("/image", upload.array("imgArr"), handleInputImage);
    this.router.get("/", upload.any(), this.controller.getAll);
    this.router.get("/:id", this.controller.getByPk);
    this.router.put("/:id", this.controller.updateProduct);
  }
}
