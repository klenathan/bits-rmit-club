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

import { Notification } from "../../Notification/Notification.model";
import { UserNoti } from "../../Notification/UserNoti.model";

import { Club } from "../../Clubs/Models/Club.model";
import { ClubUser } from "../../Clubs/Models/ClubUser.model";

@Table
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING(30),
  })
  declare username: string;

  @Column({
    type: DataType.STRING(30),
  })
  declare firstName: string;

  @Column
  declare email: string;

  @Default(false)
  @Column
  declare isAdmin: boolean;

  @Default('validating')
  @Column(DataType.ENUM('validating', 'active', 'banned'))
  declare status: string;

  @Default("heh.png")
  @Column
  declare avatar: string;

  @Column({
    type: DataType.STRING(30),
  })
  declare lastName: Date;

  @AllowNull(false)
  @Column
  declare password: string;

  @Column
  declare description: string;

  @Column({
    type: DataType.JSON,
  })
  declare otherAttributes: JSON;

  @BelongsToMany(() => Club, () => ClubUser)
  member!: Club[];

  @BelongsToMany(() => Notification, () => UserNoti)
  has!: Notification[];
  ClubUser: any;
}
