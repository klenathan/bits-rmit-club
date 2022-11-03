import { Expose } from "class-transformer";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class UserSigninDTO {
  @IsDefined()
  @Expose()
  @IsString()
  @IsNotEmpty()
  declare username: string;

  @IsDefined()
  @Expose()
  @IsString()
  @IsNotEmpty()
  declare password: string;
}
