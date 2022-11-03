import { Sequelize } from "sequelize-typescript";
import Product from "../Models/Product.model";
import BaseService from "../../Base/base.service";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";

export default class ProductService extends BaseService<Product> {
  constructor(db: Sequelize) {
    super(new Product());
  }

  create = async (payload: Partial<Product>): Promise<Product> => {
    const newProduct = await Product.create(payload).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    return newProduct;
  };

  getAllProduct = async (): Promise<Product[]> => {
    const result = await Product.findAll().catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    return result;
  };

  getByPk = async (pk: string): Promise<Product> => {
    const result = await Product.findByPk(pk)
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
    if (!result) {
      throw new NotFoundError("NOT_FOUND", `Product id ${pk} cannot be found`);
    } else {
      return result;
    }
  };

  disableProduct = async (id: string): Promise<number[]> => {
    const result = await Product.update(
      { status: false },
      { where: { id: id } }
    ).catch((e) => {
      throw new CustomError(
        e.name,
        400,
        `Failed to update order ${id} because of ${e.message}`
      );
    });
    return result;
  };

  updateProduct = async (
    id: string,
    payload: Partial<Product>
  ): Promise<number[]> => {
    const result = await Product.update(payload, {
      where: {
        id: id,
      },
    }).catch((e) => {
      throw new CustomError(
        "UNKNOWN_ERR",
        400,
        `Failed to update order ${id} because of ${e.message}`
      );
    });
    return result;
  };
}
