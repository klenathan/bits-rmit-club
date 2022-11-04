import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import ClubRouter from "./Routes/Club.routes";

export default class ClubPackage {
  declare router: Router;
  constructor(db: Sequelize) {
    this.router = new ClubRouter(db).routes;
  }
}
