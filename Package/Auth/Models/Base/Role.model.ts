import {
  Sequelize,
  Model,
  Table,
  PrimaryKey,
  Column,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import { Permission } from "./Permission.model";
import { RolePermision } from "./RolePermission.model";

@Table
export class Role extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column
  declare title: string;

  @Column
  declare active: boolean;

  @BelongsToMany(() => Permission, () => RolePermision)
  declare permissions: Permission[];

  @Column
  declare count: number;
}
