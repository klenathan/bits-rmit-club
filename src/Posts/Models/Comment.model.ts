import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  NotNull,
  PrimaryKey,
  Default,
} from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import { Post } from "./Post.model";

@Table
export class PostComment extends Model {
  @PrimaryKey
  @Default(UUIDV4())
  @Column
  declare id: string;

  @ForeignKey(() => User)
  @Column
  declare username: string;

  @ForeignKey(() => Post)
  @Column
  declare postID: string;

  @BelongsTo(() => Post, { foreignKey: "postID" })
  post!: string;

  @BelongsTo(() => User, { foreignKey: "username" })
  author!: string;

  @Column
  declare comment: string;
}
