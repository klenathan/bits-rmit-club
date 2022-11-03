import { Op, Sequelize } from "sequelize";
import Order from "../Models/Order.model";
import OrderDetail from "../Models/OrderDetail.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";

import Product from "../Models/Product.model";
import BaseService from "../../Base/base.service";

export default class OrderService extends BaseService<Order> {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    super(new Order());
    this.db = db;
  }

  getAll = async (): Promise<Order[]> => {
    let result = await Order.findAll({
      include: {
        model: Product,
      },
    });
    return result;
  };

  getByPK = async (id: string): Promise<Order> => {
    let result = await Order.findByPk(id);
    if (result) return result;
    throw new NotFoundError(
      "ORDER_NOT_FOUND",
      `The order ${id} cannot be found`
    );
  };

  create = async (payload: Partial<Order>): Promise<Order> => {
    let productArr: string[] = [];
    if (!payload.products) {
      throw new CustomError(
        "INVALID_PRODUCT_INPUT",
        400,
        `field "products" does not appear in the request`
      );
    } else {
      var productDict: any = {};
      payload.products.forEach((productItem) => {
        productDict[productItem.id] = {
          quantity: productItem.quantity,
          price: productItem.price ?? null,
        };
      });
      productArr = payload.products.map((product) => {
        return product.id;
      });
    }
    try {
      const trans = await this.db.transaction(async (t) => {
        let order = await Order.create(
          { Product: [] },
          { include: [Product], transaction: t }
        );
        let productsQuery = await Product.findAndCountAll({
          where: {
            id: productArr,
          },
        }).then((result) => {
          order.setDataValue("productArr", result.rows);
          // order.productArr = result.rows

          return result;
        });
        //////////////////// ERR CATCHING /////////////////////
        if (productsQuery.count != productArr.length) {
          // For loop
          let resultId = productsQuery.rows.map((row) => {
            return row.id;
          });
          // Filter through nonexistent product in database
          let notExistProduct = productArr.filter((id) => {
            return resultId.indexOf(id) < 0;
          });

          throw new CustomError(
            "INVALID_PRODUCT_INPUT",
            404,
            `[${notExistProduct.toString()}] does not exist on database`
          );
        }
        ///////////////////////////////////////////////////////

        for (let rowID in productsQuery.rows) {
          let row = productsQuery.rows[rowID];
          await order.$add("products", row, {
            through: {
              quantity: productDict[row.id].quantity ?? 100,
              price: productDict[row.id].price ?? row.price,
            },
            transaction: t,
          });
        }

        return order;
      });
      return trans;
    } catch (e: any) {
      throw new CustomError(e.name, 400, e.message);
    }
  };

  updateOrder = async (
    id: string,
    payload: Partial<Order>
  ): Promise<Order | number[]> => {
    const result = await Order.update(payload, {
      where: {
        id: id,
      },
    });
    if (!result) {
      throw new CustomError("UNKNOWN_ERR", 400, `Failed to update order ${id}`);
    }

    return result;
  };
}
