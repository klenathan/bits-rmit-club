import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  NotNull,
  AllowNull,
  DataType,
} from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import { Club } from "./Club.model";

@Table
export class ClubUser extends Model {
  @ForeignKey(() => User)
  @Column
  declare username: string

  @ForeignKey(() => Club)
  @Column
  declare cid: string

  @Column
  declare role: string

  @AllowNull(false)
  @Column(DataType.ENUM('pending', 'active', 'banned'))
  declare status: string

}
