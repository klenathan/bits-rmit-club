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
  ForeignKey,
} from "sequelize-typescript";
import { User } from "../Auth/Models/User.model";
import { Notification } from "./Notification.model";

@Table
export class UserNoti extends Model {
  @ForeignKey(() => User)
  @Column
  declare userId: string;

  @ForeignKey(() => Notification)
  @Column
  declare notiId: string;
}
