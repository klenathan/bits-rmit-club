import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  AllowNull,
  BelongsToMany,
  HasOne,
} from "sequelize-typescript";
import Order from "./Order.model";
import OrderDetail from "./OrderDetail.model";

@Table
export default class Product extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column
  declare quantity: number;

  @Column
  declare name: string;

  @Column
  declare color: string;

  @Column
  declare desc: string;

  @Column
  declare brand: string;

  @Column
  declare manufacturer: string;

  @AllowNull(false)
  @Column
  declare price: number;

  @Column
  declare tileBody: string;

  @Column
  declare surface: string;

  @Column
  declare collection: string;

  @AllowNull(false)
  @Default(true)
  @Column
  declare status: boolean;

  @BelongsToMany(() => Order, () => OrderDetail)
  declare products: Product[];

  
}
