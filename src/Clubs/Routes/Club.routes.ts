import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import ClubController from "../Controllers/club.controller";


export default class ClubRouter {
  declare routes: Router;
    declare controller: ClubController;
  constructor(db: Sequelize) {
    this.routes = Router();
    this.controller = new ClubController(db)
    this.routes.get("/", this.controller.getAll)
    .get("/:id", this.controller.getClubInfo)
    .post("/", this.controller.create)
    .post("/member", this.controller.addNewMember)
    .put("/edit/:id", this.controller.editClubInfo)
  }
}