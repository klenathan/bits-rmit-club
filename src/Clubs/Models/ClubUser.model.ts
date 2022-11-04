import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  NotNull,
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

}
