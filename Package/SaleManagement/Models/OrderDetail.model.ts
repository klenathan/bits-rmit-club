import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
} from "sequelize-typescript";
import Order from "./Order.model";
import Product from "./Product.model";


@Table
export default class OrderDetail extends Model {

    @ForeignKey(() => Order)
    @Column
    declare orderId: string

    @ForeignKey(() => Product)
    @Column
    declare productId: string

    @Default(null)
    @Column
    declare price: number

    @Column
    declare quantity: number

    @Column
    declare unit: string
}