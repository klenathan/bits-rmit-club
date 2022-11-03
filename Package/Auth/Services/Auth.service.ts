import * as bcrypt from "bcrypt";
import UserService from "./User.service";
import jwt, { Jwt } from "jsonwebtoken";
import CustomError from "../Errors/CustomError";
import { Sequelize } from "sequelize-typescript";
import { signNewToken } from "./../Utils/SignNewToken";
import process from "process";
import dotenv from "dotenv";
import { RefreshToken } from "./../Models";
dotenv.config();

// -- Class for process password
export class PassWordUtils {
  public bcrypt = bcrypt;
  saltRounds: number = 10;
  constructor() {}

  public async hashPW(rawPw: string): Promise<string> {
    return this.bcrypt.hash(rawPw, this.saltRounds);
  }

  public async checkHashedPW(rawPw: string, hashed: string): Promise<boolean> {
    return this.bcrypt.compare(rawPw, hashed);
  }
}

// -- Token generate options
export class AuthOptions {
  public issuer: string;
  public audience: string;
  public subject: string;
  public expiresIn: string;
  public static authOptions: AuthOptions;
  private constructor() {
    this.issuer = "skdv.locphat.com";
    this.audience = "skdv.6868.com";
    this.subject = "test";
    this.expiresIn = "1h";
  }

  public static getAuthOptions() {
    if (!this.authOptions) {
      return new AuthOptions();
    }
    return this.authOptions;
  }
}

export default class Authentication {
  public db: Sequelize;
  public options: AuthOptions;
  private userService: UserService;
  public constructor(authOptions: AuthOptions, db: Sequelize) {
    this.options = authOptions;
    this.db = db;
    this.userService = new UserService(db);
  }

  // -- Signin method --
  public async signIn(payload: ILoginCredential): Promise<any> {
    const user = await this.userService.getOne(payload.username);
    const passWordUtils = new PassWordUtils();
    const isPasswordValid = await passWordUtils.checkHashedPW(
      payload.password,
      user.password
    );
    if (!isPasswordValid)
      throw new CustomError("INVALID_CREDENTIALS", 401, "Login failed");
    let jwtToken: string | null = null;
    let refreshToken: string | null = null;
    // Wrap new promise for async token generate

    jwtToken = await signNewToken(
      {
        username: user.username,
        role: user.role,
      },
      {
        issuer: "SKDV68.com",
        audience: "locphatskdv",
        tokenType: "access",
        expiresIn: "3h",
        algorithms: "HS256",
      }
    );

    refreshToken = await signNewToken(
      {
        username: user.username,
        role: user.role,
      },
      {
        issuer: "SKDV68.com",
        audience: "locphatskdv",
        tokenType: "refresh",
        expiresIn: "30d",
        algorithms: "HS256",
      }
    );

    await RefreshToken.upsert({
      username: user.username,
      token: refreshToken,
    });

    const result = {
      username: user.username,
      role: user.role,
      accessToken: jwtToken,
      refreshToken,
    };
    return result;
  }
}

export interface ILoginSuccessResult {
  username: string;
  accessToken: string;
}

export interface ILoginCredential {
  username: string;
  password: string;
}
