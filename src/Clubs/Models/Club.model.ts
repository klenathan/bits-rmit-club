import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsToMany,
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

  @Default('heh.png')
  @Column
  declare avatar: string;

  @Default('heh.png')
  @Column
  declare background: string;

  @Column
  declare desc: string;

  @ForeignKey(() => User)
  @Column
  declare president: string;

  @Default("pending")
  @Column(DataType.ENUM('pending', 'active', 'banned'))
  declare status: string

  @BelongsToMany(() => User, () => ClubUser)
  member!: User[];


}

