import { NextFunction, Request, Response } from "express";
import { Sequelize } from "sequelize-typescript";
import ClubService from "../Services/Club.service";

import { RequestNewClubDTO } from "../DTOs/RequestNewClubDTO";
import CustomError from "../../App/Middlewares/Errors/CustomError";

export default class ClubController {
  declare db: Sequelize;
  declare service: ClubService;
  constructor(db: Sequelize) {
    this.service = new ClubService(db);
    this.db = db;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let files = req.files as Express.Multer.File[];
      // console.log(files);

      const payload = req.body;
      return await this.service
        .create(payload, files[0], files[1])
        .then((result) => {
          return res.status(200).send(result);
        });
    } catch (error) {
      console.log(error);

      return next(error);
    }
  };

  editClubInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let clubId = req.params.id;
      return await this.service
        .editClubInfo(clubId, req.body)
        .then((result) => {
          return res.send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  editClubBackground = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let clubId = req.params.id;
      let files = req.files as Express.Multer.File[];
      return await this.service
        .changeBackground(clubId, files[0])
        .then((result) => {
          return res.send({
            message: ` Edited ${result} clubs info: ${clubId}`,
          });
        });
    } catch (e) {
      return next(e);
    }
  };

  promoteToPresident = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let newPresident = req.body.newPresident;
      let clubId = req.params.id;
      let user = req.body.user;
      return await this.service
        .promoteToPresident(user, newPresident, clubId)
        .then((result) => {
          return res.send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  requestClub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = req.body.username ?? req.body.user;
      const clubId = req.params.id;
      return await this.service.requestClub(username, clubId).then((r) => {
        return res.status(200).send(r);
      });
    } catch (e) {
      return next(e);
    }
  };

  getRequestClub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const username = req.query.username ?? req.query.user;
      const clubId = req.params.id;
      return await this.service.getRequestClub(clubId).then((r) => {
        return res.status(200).send(r);
      });
    } catch (e) {
      return next(e);
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

  removeMember = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      if (!(req.query.clubId && req.query.user))
        return next(
          new CustomError(
            "INVALID_INPUT",
            400,
            "Please include clubId and user in params"
          )
        );
      const clubID = req.query.clubId as string;
      const user = req.query.user as string;

      return await this.service.removeMember(clubID, user).then((result) => {
        return res
          .status(200)
          .send({ message: `Deleted ${result} members from club ${clubID}` });
      });
    } catch (e) {
      return next(e);
    }
  };

  editUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubID = req.body.clubId;
      const user = req.body.user;
      const role: string = req.body.role;
      // const role: string = req.body.role;
      return await this.service.editUserRole(clubID, user, role).then((r) => {
        return res.status(200).send(r);
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

  newClub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let payload: RequestNewClubDTO = req.body;
      if (!payload.user || !payload.name || !payload.clubid) {
        return next(
          new CustomError(
            "MISSING_FIELDS",
            400,
            "Please include requester, club name and clubID in payload"
          )
        );
      }
      let files = req.files as Express.Multer.File[];
      return await this.service
        .newClub(payload, files[0], files[1])
        .then((result) => {
          return res.status(200).send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  getAllClubRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return await this.service.getAllClubRequest().then((result) => {
        return res.status(200).send(result);
      });
    } catch (e) {
      return next(e);
    }
  };

  acceptNewClub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let requester = req.body.user;
      let clubID = req.body.clubID;
      return await this.service.acceptNewClub(requester, clubID).then((r) => {
        return res.status(200).send(r);
      });
    } catch (e) {
      return next(e);
    }
  };

  rejectNewClub = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let requester = req.body.user;
      let clubID = req.body.clubID;
      return await this.service.rejectNewClub(requester, clubID).then((r) => {
        return res.status(200).send(r);
      });
    } catch (e) {
      return next(e);
    }
  };

  banMember = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username || !req.body.clubID || !req.body.requester) {
      return next(
        new CustomError(
          "INVALID_INPUT",
          400,
          "Request must include username, clubID and requester"
        )
      );
    }
    try {
      return await this.service
        .banMember(req.body.username, req.body.clubID, req.body.requester)
        .then((result) => {
          return res.status(200).send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  unbanMember = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username || !req.body.clubID || !req.body.requester) {
      return next(
        new CustomError(
          "INVALID_INPUT",
          400,
          "Request must include username, clubID and requester"
        )
      );
    }
    try {
      return await this.service
        .unbanMember(req.body.username, req.body.clubID, req.body.requester)
        .then((result) => {
          return res.status(200).send(result);
        });
    } catch (e) {
      return next(e);
    }
  };

  acceptNewMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let requester = req.body.requester;
      let member = req.body.member;
      let clubid = req.body.clubID;
      return await this.service
        .acceptNewMember(requester, clubid, member)
        .then((r) => {
          return res.status(200).send(r);
        });
    } catch (e) {
      return next(e);
    }
  };

  rejectNewMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let requester = req.body.requester;
      let member = req.body.member;
      let clubid = req.body.clubID;
      return await this.service
        .rejectNewMember(requester, clubid, member)
        .then((r) => {
          return res.status(200).send(r);
        });
    } catch (e) {
      return next(e);
    }
  };
}
