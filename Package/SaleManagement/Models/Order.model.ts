import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  BelongsToMany,
} from "sequelize-typescript";
import OrderDetail from "./OrderDetail.model";
import Product from "./Product.model";

@Table
export default class Order extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  declare id: string;

  @Default(false)
  @Column
  declare confirmation: boolean;

  @Column
  declare customerUsername: string;

  @Default(false)
  @Column
  declare isPaid: boolean;

  @Default(0)
  @Column
  declare paid: bigint;

  @Default("ordered")
  @Column
  declare stage: string;

  declare productArr: Product[]

  @BelongsToMany(() => Product, () => OrderDetail)
  declare products: Product[];
}
