import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Permission } from "./Permission.model";
import { Role } from "./Role.model";

@Table
export class RolePermision extends Model {
  @ForeignKey(() => Role)
  @Column
  declare roleId: string;

  @ForeignKey(() => Permission)
  @Column
  declare permissionId: number;
}
