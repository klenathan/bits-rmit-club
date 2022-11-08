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

  editClubInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let clubId = req.params.id;
      return await this.service
        .editClubInfo(clubId, req.body)
        .then((result) => {
          return res.send({ message: ` Edited ${result} clubs info: ${clubId}` });
        });
    } catch (e) {
      return next(e);
    }
  };

  promoteToPresident = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let newPresident = req.body.newPresident
      let clubId = req.params.id
      let user = req.body.user
      return await this.service.promoteToPresident(user, newPresident, clubId).then(result => {
        return res.send(result)
      })
    } catch (e) {
      return next(e)
    }
  }

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
