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
      .get("/newclub",this.controller.getAllClubRequest)
      //// New Club
      .post("/newclub", upload.any(), this.controller.newClub)
      .post("/acceptnewclub", upload.any(), this.controller.acceptNewClub)
      .post("/rejectnewclub", upload.any(), this.controller.rejectNewClub)
      /// Member related
      .post("/request/:id", upload.any(), this.controller.requestClub)
      .post("/member", this.controller.addNewMember)
      .put("/member", this.controller.editUserRole)
      .delete("/member", this.controller.removeMember)
      .post("/ban", this.controller.banMember)
      .post("/unban", this.controller.unbanMember)
      // Club data edit
      .put("/background/:id", upload.any(), this.controller.editClubBackground)
      .put("/edit/:id", upload.any(), this.controller.editClubInfo)
      .put("/promote/:id", this.controller.promoteToPresident)
      .get("/:id", this.controller.getClubInfo);
  }
}
