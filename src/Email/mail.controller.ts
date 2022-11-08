import { Sequelize } from "sequelize";
import * as nodemailer from "nodemailer";
import { Request, Response } from "express";

export default class MailerController {
  constructor(db: Sequelize) {

  }

  sendEmail = async (req: Request, res: Response) => {
    
  };
}
