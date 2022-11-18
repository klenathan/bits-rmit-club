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
  BelongsTo,
  NotNull,
  BelongsToMany,
} from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import { Club } from "../../Clubs/Models/Club.model";
import { PostComment } from "./Comment.model";
import { PostLike } from "./PostLike.model";

@Table
export class Post extends Model {
  @PrimaryKey
  @Default(UUIDV4())
  @Column
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => Club)
  @Column
  declare author: string;

  @BelongsTo(() => Club, { foreignKey: "author" })
  postAuthor!: Club;

  @Column
  declare content: string;

  declare likeCount: number;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  declare imgLink: string[];

  @HasMany(() => PostComment)
  comments!: PostComment[];

  @BelongsToMany(() => User, () => PostLike)
  likes!: User[];

  declare createdAt?: string;
}
