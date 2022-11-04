import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  PrimaryKey,
  AllowNull,
  Default,
  ForeignKey,
  BelongsToMany
} from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import { ClubUser } from "./ClubUser.model";

@Table
export class Club extends Model {
  @PrimaryKey
  @Column
  declare clubid: string;

  @Column
  declare name: string;

  @Column
  declare desc: string;

  @ForeignKey(() => User)
  @Column
  declare president: string;

  @BelongsToMany(() => User, () => ClubUser)
  member!: User[];

}
