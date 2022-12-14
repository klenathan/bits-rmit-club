import { Router } from "express";
import multer from "multer";
import { Sequelize } from "sequelize-typescript";
import ClubController from "../Controllers/club.controller";

const upload = multer();

export default class ClubRouter {
  declare routes: Router;
  declare controller: ClubController;
  constructor(db: Sequelize) {
    this.routes = Router();
    this.controller = new ClubController(db);
    this.routes
      .get("/", this.controller.getAll)
      .post("/", upload.any(), this.controller.create)
      .post("/request/:id", upload.any(),this.controller.requestClub)
      .post("/member", this.controller.addNewMember)
      .put("/edit/:id", this.controller.editClubInfo)
      .put("/promote/:id", this.controller.promoteToPresident)
      .get("/:id", this.controller.getClubInfo)
  }
}
