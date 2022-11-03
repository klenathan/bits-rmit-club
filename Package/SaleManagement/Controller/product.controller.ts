// import {} from "../services/product.service";
import ProductService from "../services/product.service";
// import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import CustomError from "../../../Package/App/Middlewares/Errors/CustomError";

//testing purpose

export default class ProductController {
  declare productService: ProductService;

  constructor(db: Sequelize) {
    this.productService = new ProductService(db);
  }
  // Still can only catch in controller
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload = req.body;
      const result = await this.productService.create(payload)
      return res.status(200).send(result);
    } catch (e) {
      console.log(e);
      
      return next(e);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.getAllProduct();

      return res.status(200).send(result);
    } catch (e) {
      return next(e);
    }
  };

  getByPk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      const result = await this.productService.getByPk(id);
      return res.status(200).send(result);
    } catch (e) {
      return next(e);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;
      let payload = req.body;
      return await this.productService.update(id, payload);
    } catch (e) {
      return next(e);
    }
  };

  // TODO: consider disable or delete product on the database
  // async disableProduct()
}
