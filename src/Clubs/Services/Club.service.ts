import { Sequelize } from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import { Club } from "../Models/Club.model";

export default class ClubService {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    this.db = db;
  }

  create = async (payload: Partial<Club>) => {
    
    const presidentUser = await User.findByPk(payload.president, {
      attributes: { exclude: ["password"] },
    });

    if (presidentUser) {
      let newClub = await Club.create(payload, { include: User }).catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

      await newClub.$add("member", presidentUser, {
        through: {
          role: "admin",
        },
      });
      return newClub;
    } else {
      throw new CustomError(
        "USER_NOT_FOUND",
        404,
        `${payload.president} cannot be found`
      );
    }
  };

  getClubInfo = async (clubID: string) => {
    return await Club.findByPk(clubID, {
      include: {
        model: User,
        attributes: ["username", "firstName", "lastName", "role"],
      },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  editClubInfo = async (clubId: string, payload: Partial<Club>) => {
    return await Club.update(payload, {
      where: { clubid: clubId },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  addClubMember = async (
    clubID: string,
    userArr: { username: string; role: string }[]
  ) => {
    let tempUserDict: any = {};
    userArr.forEach((user) => {
      tempUserDict[user.username] = user.role;
    });
    const users = await User.findAll({
      where: {
        username: userArr.map((user) => user.username),
      },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    const club = await Club.findByPk(clubID).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    if (users.length != userArr.length) {
      throw new CustomError(
        "USER_NOT_FOUND",
        404,
        "Some users cannot be found"
      );
    } else if (!club) {
      throw new CustomError("CLUB_NOT_FOUND", 404, "Invalid club ID");
    } else {
      for (let user of users) {
        club.$add("member", user, {
          through: {
            role: tempUserDict[user.username],
          },
        });
      }
      return club;
    }
  };

  getAllClub = async () => {
    return await Club.findAll({
      include: {
        model: User,
        attributes: ["username", "firstName", "lastName", "role"],
      },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };
}
