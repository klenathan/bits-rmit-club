import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import { Post } from "./Post.model";

@Table
export class PostLike extends Model {
  @ForeignKey(() => User)
  @Column
  declare uID: string;

  @ForeignKey(() => Post)
  @Column
  declare pID: string;

//   @BelongsTo(() => Post, {foreignKey: 'pID'})
//   declare post: string 

}
