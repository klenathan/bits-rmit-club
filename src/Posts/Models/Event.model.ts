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
} from "sequelize-typescript";
import { Club } from "../../Clubs/Models/Club.model";

@Table
export class ClubEvent extends Model {
  @PrimaryKey
  @Default(UUIDV4())
  @Column
  declare id: string;

  @AllowNull(false)
  @Column
  declare name: string;

  @AllowNull(false)
  @Column
  declare startDate: Date;

  @Column
  declare content: string;

  @AllowNull(false)
  @ForeignKey(() => Club)
  @Column
  declare author: string;

  @BelongsTo(() => Club, { foreignKey: "author" })
  eventAuthor!: Club;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  declare imgLink: string[];

  declare createdAt?: string;
}
