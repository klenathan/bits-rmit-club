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
import { Club } from "../../Clubs/Models/Club.model";

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

  @Column(DataType.ARRAY(DataType.STRING))
  declare likeList: string[];

  @Column
  declare imgLink: string;
}
