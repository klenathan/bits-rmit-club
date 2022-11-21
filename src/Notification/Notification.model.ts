import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  PrimaryKey,
  AllowNull,
  BelongsToMany,
  Default,
} from "sequelize-typescript";
import { User } from "../Auth/Models/User.model";
import { UserNoti } from "./UserNoti.model";

@Table
export class Notification extends Model {
  @PrimaryKey
  @Default(UUIDV4())
  @Column
  declare id: string;

  @Column
  declare image: string;

  @Column
  declare type: string;

  @AllowNull(false)
  @Column
  declare content: string;

  @BelongsToMany(() => User, () => UserNoti)
  notiTo!: User[];

  declare createdAt?: string;
}
