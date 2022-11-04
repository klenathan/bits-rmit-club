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
} from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";

@Table
export class Post extends Model {
  @PrimaryKey
  @Default(UUIDV4())
  @Column
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  declare author: string;

  @BelongsTo(() => User, { foreignKey: "author" })
  postAuthor!: User;

  @Column
  declare content: string;

  @Column(DataType.ARRAY(DataType.STRING))
  declare likeList: string[];

  @Column
  declare imgLink: string;
}
