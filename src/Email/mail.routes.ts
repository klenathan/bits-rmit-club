import * as nodemailer from "nodemailer";
import Express, {Router} from "express";
import multer from "multer";
import { Sequelize } from "sequelize-typescript";

//
import MailerController from "./mail.controller";

const upload = multer();

export default class MailRouter {
  declare router: Router;
  declare controller: MailerController;

  constructor(db: Sequelize) {
    this.router = Router()
    this.controller = new MailerController(db);
    this.router.post("/", this.controller.sendEmail);
  }
}
