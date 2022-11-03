import {
  Sequelize,
  Model,
  Table,
  PrimaryKey,
  Column,
  AllowNull,
} from "sequelize-typescript";

@Table
export class RefreshToken extends Model {
  @PrimaryKey
  @Column
  declare username: string;

  @AllowNull(false)
  @Column
  declare token: string;
}
