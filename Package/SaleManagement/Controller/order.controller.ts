import OrderService from "../Services/order.service";
import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import CustomError from "../../App/Middlewares/Errors/CustomError";


export default class OrderController {
  declare orderService: OrderService;

  constructor(db: Sequelize) {
    this.orderService = new OrderService(db);
  }

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.orderService
        .getAll()
        .then((result) => res.status(200).send({ result }));
    } catch (error) {
      return next(error);
    }
  };

  getByPK = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.id) {
        throw new CustomError(
          "INVALID_INPUT",
          400,
          'URL params "id" cannot be found'
        );
      }
      return await this.orderService
        .getByPK(req.params.id)
        .then((result) => res.status(200).send(result));
    } catch (e) {
      return next(e);
    }
  };

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      return await this.orderService.create(payload).then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body.data;
      const id = req.params.id;
      return await this.orderService
        .updateOrder(id, payload)
        .then((result) => res.status(200).send(result))
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });
    } catch (error) {
      return next(error);
    }
  };
}
