import {
  Sequelize,
  Model,
  Table,
  PrimaryKey,
  Column,
  AllowNull,
  AutoIncrement,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import { Role } from "./Role.model";
import { RolePermision } from "./RolePermission.model";

@Table
export class Permission extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @AllowNull(true)
  @Column
  declare description: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  declare context: JSON;

  @BelongsToMany(() => Role, () => RolePermision)
  declare roles: Role[];
}
