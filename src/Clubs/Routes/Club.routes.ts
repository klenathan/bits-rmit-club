import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import ClubController from "../Controllers/club.controller";

export default class ClubRouter {
  declare routes: Router;
  declare controller: ClubController;
  constructor(db: Sequelize) {
    this.routes = Router();
    this.controller = new ClubController(db);
    this.routes
      .get("/", this.controller.getAll)
      .post("/", this.controller.create)
      .get("/newclub", this.controller.getAllClubRequest)
      //// New Club
      .post("/newclub", this.controller.newClub)
      .post("/acceptnewclub", this.controller.acceptNewClub)
      .post("/rejectnewclub", this.controller.rejectNewClub)
      /// Member related
      .get("/request/:id", this.controller.getRequestClub)
      .post("/request/:id", this.controller.requestClub)
      .post("/member", this.controller.addNewMember)
      .put("/member", this.controller.editUserRole)
      .delete("/member", this.controller.removeMember)
      .post("/ban", this.controller.banMember)
      .post("/unban", this.controller.unbanMember)
      .post("/approve", this.controller.acceptNewMember)
      .post("/reject", this.controller.rejectNewMember)
      // Club data edit
      .put("/background/:id", this.controller.editClubBackground)
      .put("/edit/:id", this.controller.editClubInfo)
      .put("/promote/:id", this.controller.promoteToPresident)
      .get("/:id", this.controller.getClubInfo);
  }
}
