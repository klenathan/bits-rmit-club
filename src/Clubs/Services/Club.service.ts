import { Sequelize } from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import { Club } from "../Models/Club.model";
import { ClubUser } from "../Models/ClubUser.model";
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";



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
          role: "president",
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
        attributes: ["username", "firstName", "lastName"],
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

  promoteToPresident = async (
    requester: string,
    username: string,
    clubId: string
  ) => {
    let currentPresident = await ClubUser.findOne({
      where: { role: "president", cid: clubId },
    })
      .then(async (result) => {
        // Check if user is Club's president
        if (!(result?.username == requester)) {
          // Check if user is APP Admin
          await User.findByPk(requester).then((requesterInfo) => {
            if (!requesterInfo?.isAdmin) {
              throw new CustomError(
                "UNAUTHORIZED",
                403,
                "You do not have permission for this action"
              );
            }
          });
        } else if (result?.username == username) {
          throw new CustomError(
            "USER_IS_PRESIDENT",
            400,
            `${username} is already the president`
          );
        } else {
          await result?.update({ role: "member" });
        }
        return result;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    await ClubUser.findAndCountAll({
      where: { username: username, role: "president" },
    }).then((result) => {
      if (result.count > 1)
        throw new CustomError(
          "USER_ALREADY_PRESIDENT",
          400,
          `${username} is currently a president of a different club`
        );
    });

    // Get current candidate information
    let clubUser = await ClubUser.findOne({
      where: { username: username, cid: clubId },
      attributes: { exclude: ["createdAt"] },
    }).then((result) => {
      if (!result)
        throw new NotFoundError("USER_NOT_FOUND", `${username} is not found`);
      if (result.role == "president")
        throw new CustomError(
          "USER_IS_PRESIDENT",
          400,
          `${username} is already the president`
        );
      else {
        result.update({ role: "president" });
        return result;
      }
    });
    let curr = currentPresident?.username ?? "none";
    return {
      message: `${clubUser.username} has been promoted to president, replacing ${curr}`,
      newPresident: clubUser,
    };
  };
}
