import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import ClubService from "../Services/Club.service";

export default class ClubController {
  declare db: Sequelize;
  declare service: ClubService;
  constructor(db: Sequelize) {
    this.service = new ClubService(db);
    this.db = db;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      return await this.service.create(payload).then((result) => {
        return res.status(200).send(result);
      });
    } catch (error) {
      return next(error);
    }
  };

  addNewMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubID = req.body.clubId;
      const userArr = req.body.users;
      return await this.service
        .addClubMember(clubID, userArr)
        .then((result) => {
          return res.status(200).send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  getClubInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service.getClubInfo(req.params.id).then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await this.service.getAllClub().then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };
}
