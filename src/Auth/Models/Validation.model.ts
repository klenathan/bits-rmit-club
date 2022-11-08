import {
    Table,
    Column,
    Model,
    AllowNull,
    ForeignKey,
    Unique,
  } from "sequelize-typescript";
import { User } from "./User.model";
  
  @Table
  export class UserValidator extends Model {

    @ForeignKey(() => User)
    @Unique
    @Column
    declare username: string;

    @AllowNull(false)
    @Column
    declare key: string;
  }
  