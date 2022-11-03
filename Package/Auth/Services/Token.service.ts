import { RefreshToken } from "./../Models";
import { Sequelize } from "sequelize-typescript";
import BaseService from "./base.service";
import CustomError from "./../Errors/CustomError";

export default class RefreshTokenService extends BaseService<RefreshToken> {
  public db: Sequelize;
  constructor(db: Sequelize) {
    super(new RefreshToken());
    this.db = db;
  }

  async compareToken(token: string): Promise<boolean> {
    const refreshToken = await RefreshToken.findOne({
      where: { token },
    });
    if (!refreshToken)
      throw new CustomError(
        "REFRESH_TOKEN_REVOKED",
        404,
        "Your refreshToken does not exist or has been revoke, please sign in again"
      );
    return true;
  }

  //   async deleteByPK(pk: string): Promise<any> {
  //       const deleted = await RefreshToken.destroy()
  //   }
}
