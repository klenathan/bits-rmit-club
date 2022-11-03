"use strict";
const process = require("process");
import dotenv from "dotenv";
dotenv.config();
const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];
import { Sequelize } from "sequelize-typescript";
export default class Database {
  private static instance: Sequelize;
  private constructor() {}

  public static getInstance(): Sequelize {
    console.log(config);
    if (!this.instance) {
      let sequelize: Sequelize;
      if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
      } else {
        sequelize = new Sequelize(config);
      }
      this.instance = sequelize;
      return this.instance;
    }

    return this.instance;
  }

  public static modelSync(): Promise<Sequelize> {
    if (!this.instance) {
      throw new Error("DB instanced was not created");
    }
    return this.instance.sync();
  }
}
