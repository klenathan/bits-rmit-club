import { Sequelize } from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import { Club } from "../Models/Club.model";
import { ClubUser } from "../Models/ClubUser.model";
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";
import { NewNotiUtil } from "../../Base/Utils/notiEvent";
import { RequestNewClubDTO } from "../DTOs/RequestNewClubDTO";
import sharp from "sharp";
import { Op } from "sequelize";
import * as Banning from "./Banning.service";

export default class ClubService {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    this.db = db;
  }

  // Banning Club member

  banMember = Banning.banMember;
  unbanMember = Banning.unbanMember;

  create = async (
    payload: Partial<Club>,
    avatar: Express.Multer.File,
    bg: Express.Multer.File
  ) => {
    const presidentUser = await User.findByPk(payload.president, {
      attributes: { exclude: ["password"] },
    });

    if (presidentUser) {
      // Ava handle
      const newFileName = `clubAva-${Date.now()}-${avatar.originalname}`;
      await sharp(avatar.buffer)
        .toFile(`Images/${newFileName}`)
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });
      payload.avatar = newFileName;

      const newBgName = `clubBg-${Date.now()}-${bg.originalname}`;

      await sharp(bg.buffer)
        .toFile(`Images/${newBgName}`)
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });

      payload.background = newBgName;

      payload.status = "active";

      let newClub = await Club.create(payload, { include: User }).catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

      await newClub.$add("member", presidentUser, {
        through: {
          role: "president",
          status: "active",
        },
      });
      return newClub;
    } else {
      throw new CustomError(
        "USER_NOT_FOUND",
        404,
        `user ${payload.president} cannot be found`
      );
    }
  };

  getClubInfo = async (clubID: string) => {
    return await Club.findByPk(clubID, {
      include: {
        model: User,
        attributes: ["username", "firstName", "lastName", "avatar"],
      },
    })
      .then((res) => {
        if (res == null)
          throw new NotFoundError("NOT_FOUND", `${clubID} cannot be found`);
        return res;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
  };

  editClubInfo = async (clubId: string, payload: Partial<Club>) => {
    let club = await Club.findByPk(clubId)
      .then((r) => {
        if (!r) {
          throw new NotFoundError(
            "CLUB_NOT_FOUND",
            `${clubId} cannot be found`
          );
        }

        if (r.status != "active") {
          throw new CustomError(
            "UNAVAILABLE_CLUB",
            400,
            `${clubId} is in pending status or has been banned`
          );
        }
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
    club.update(payload);
    club.save();
    return club;
    // return await Club.update(payload, {
    //   where: { clubid: clubId },
    // }).catch((e) => {
    //   throw new CustomError(e.name, 400, e.message);
    // });
  };

  changeBackground = async (
    clubId: string,
    backgroundImg: Express.Multer.File
  ) => {
    const newFileName = `clubBg-${Date.now()}-${backgroundImg.originalname}`;

    await sharp(backgroundImg.buffer)
      .toFile(`Images/${newFileName}`)
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
    let payload: any = {};

    payload.background = newFileName;

    return await Club.update(payload, {
      where: { clubid: clubId },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  requestClub = async (username: string, clubId: string) => {
    await Club.findByPk(clubId)
      .then((r) => {
        if (!r) {
          throw new NotFoundError(
            "CLUB_NOT_FOUND",
            `${clubId} cannot be found`
          );
        }

        if (r.status != "active") {
          throw new CustomError(
            "UNAVAILABLE_CLUB",
            400,
            `${clubId} is in pending status or has been banned`
          );
        }
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
    let current = await ClubUser.findOne({
      where: { username: username, cid: clubId },
    })
      .then((r) => {
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    if (current) {
      throw new CustomError(
        "REQUEST_EXIST",
        400,
        `${username} has already joined or requested to club ${clubId}`
      );
    }

    let user = await User.findByPk(username).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    if (!user) {
      throw new NotFoundError("USER_NOT_FOUND", `${username} cannot be found`);
    }

    let club = await Club.findByPk(clubId).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    if (!club) {
      throw new NotFoundError("CLUB_NOT_FOUND", `${clubId} cannot be found`);
    }

    return await club.$add("member", user, {
      through: {
        role: "member",
        status: "pending",
      },
    });
  };

  getRequestClub = async (clubId: string) => {
    let club = await Club.findByPk(clubId).then((r) => {
      if (!r) {
        throw new NotFoundError("CLUB_NOT_FOUND", `${clubId} cannot be found`);
      }
    });
    let result = await ClubUser.findAll({
      where: { cid: clubId, status: "pending" },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    return result;
  };

  removeMember = async (id: string, userArr: string[]) => {
    let clubUserQuery = await ClubUser.findAll({
      where: { username: { [Op.in]: userArr }, cid: id },
    });

    if (clubUserQuery.length != userArr.length) {
      throw new NotFoundError("USER_NOT_FOUND", "Some user cannot be found");
    }

    let deleteResult = await ClubUser.destroy({
      where: { username: { [Op.in]: userArr }, cid: id },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    return deleteResult;
  };

  editUserRole = async (id: string, user: string, role: string) => {
    let result = await ClubUser.update(
      { role: role },
      {
        where: { username: user, cid: id },
      }
    ).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    return await ClubUser.findOne({ where: { username: user, cid: id } }).catch(
      (e) => {
        throw new CustomError(e.name, 400, e.message);
      }
    );
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

    const club = await Club.findByPk(clubID)
      .then((r) => {
        if (!r) {
          throw new NotFoundError(
            "CLUB_NOT_FOUND",
            `${clubID} cannot be found`
          );
        }

        if (r.status != "active") {
          throw new CustomError(
            "UNAVAILABLE_CLUB",
            400,
            `${clubID} is in pending status or has been banned`
          );
        }
        return r;
      })
      .catch((e) => {
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
            status: "active",
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
        attributes: { exclude: ["password"] },
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
        // console.log(result?.username, username, result?.username == username);

        // if (!(result?.username == requester)) {
        //   // Check if user is APP Admin
        //   await User.findByPk(requester).then((requesterInfo) => {
        //     if (!requesterInfo?.isAdmin) {
        //       throw new CustomError(
        //         "UNAUTHORIZED",
        //         403,
        //         "You do not have permission for this action"
        //       );
        //     }
        //   });
        // } else
        if (result?.username == username) {
          console.log("here");

          throw new CustomError(
            "USER_IS_PRESIDENT",
            400,
            `${username} is already the president`
          );
          return;
        } else {
          console.log("update");
        }
        await result?.update({ role: "member" });
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
        throw new NotFoundError(
          "USER_NOT_FOUND",
          `${username} is not found in club ${clubId}`
        );

      if (result.role == "president")
        throw new CustomError(
          "USER_IS_PRESIDENT",
          400,
          `${username} is already the president`
        );
      else {
        result.update({ role: "president" });
        result.save();
        return result;
      }
    });

    let curr = currentPresident?.username ?? "none";

    await Club.findByPk(clubId).then(async (r) => {
      r?.update({ president: clubUser.username });

      if (!r) {
        return false;
      }
      await this.notifyNewPresident(r, clubUser);
      return true;
    });

    return {
      message: `${clubUser.username} has been promoted to president, replacing ${curr}`,
      newPresident: clubUser,
    };
  };

  notifyNewPresident = async (club: Club, newPresident: ClubUser) => {
    let content = `${newPresident.username} has been promoted to president for club ${club.name}`;
    let members = await club.$get("member");
    let memberUsername = members.map((mem) => {
      return mem.username;
    });
    console.log("new noti: ", content);

    await NewNotiUtil(
      memberUsername,
      content,
      `club:${club.clubid}`,
      "new_president",
      club.avatar
    );
  };

  newClub = async (
    payload: RequestNewClubDTO,
    avatar: Express.Multer.File,
    bg: Express.Multer.File
  ) => {
    //// Get president/requester information
    let president = await User.findByPk(payload.user, { include: [Club] })
      .then((r) => {
        r?.member.forEach((club) => {
          if (club.president == payload.user) {
            throw new CustomError(
              "USER_ALREADY_PRESIDENT",
              400,
              `${payload.user} has already been a president for club ${club.name}`
            );
          }
        });
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    if (!president) {
      throw new NotFoundError(
        "USER_NOT_FOUND",
        `${payload.user} cannot be found`
      );
    }

    //// Upload image

    payload.avatar = await this.handleImageUpload(avatar, "clubAva");
    payload.background = await this.handleImageUpload(bg, "clubBg");
    payload.president = president.username;

    //// Create club request
    let club = await Club.create(payload)
      .then((r) => {
        console.log(r);

        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    return club;
  };

  getAllClubRequest = async () => {
    let result = await Club.findAll({ where: { status: "pending" } });
    return result;
  };

  handleImageUpload = async (
    file: Express.Multer.File,
    prefix: string
  ): Promise<string> => {
    const newFileName = `${prefix}-${Date.now()}-${file.originalname}`;

    await sharp(file.buffer)
      .toFile(`Images/${newFileName}`)
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
    return newFileName;
  };

  acceptNewClub = async (requester: string, clubID: string) => {
    let user = await User.findByPk(requester)
      .then((r) => {
        if (!r?.isAdmin) {
          throw new CustomError(
            "UNAUTHORIZED",
            403,
            `${requester} is not authorized for this task`
          );
        }
        return r?.isAdmin;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    let club = await Club.findByPk(clubID)
      .then((r) => {
        if (r?.status != "pending")
          throw new CustomError(
            "INVALID_CLUB_STATUS",
            400,
            `${clubID}'s not in pending status`
          );
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    club.update({ status: "active" });
    club.save();
    return club;
  };

  rejectNewClub = async (requester: string, clubID: string) => {
    let user = await User.findByPk(requester)
      .then((r) => {
        if (!r?.isAdmin) {
          throw new CustomError(
            "UNAUTHORIZED",
            403,
            `${requester} is not authorized for this task`
          );
        }
        return r?.isAdmin;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    let club = await Club.findByPk(clubID)
      .then((r) => {
        if (r?.status != "pending")
          throw new CustomError(
            "INVALID_CLUB_STATUS",
            400,
            `${clubID}'s not in pending status`
          );
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    club.destroy();
    club.save();
    return { success: `Rejected club ${clubID}` };
  };

  acceptNewMember = async (
    requester: string,
    clubid: string,
    member: string
  ) => {
    /// auth check
    let clubPresident = await Club.findByPk(clubid).then((r) => {
      if (!r) {
        throw new NotFoundError("CLUB_NOT_FOUND", `${clubid} cannot be found`);
      }
      if (r.president != requester) {
        throw new CustomError(
          "UNAUTHORIZED",
          403,
          `${requester} is not authorized for this task in club ${clubid}`
        );
      }
    });
    let clubMember = await ClubUser.findOne({
      where: { cid: clubid, username: member },
    }).then((r) => {
      if (!r) {
        throw new NotFoundError(
          `MEMBER_NOT_FOUND`,
          `${member} cannot be found in club ${clubid}`
        );
      }
      return r;
    });

    clubMember.update({ status: "active" });
    clubMember.save();
    return clubMember;
  };

  rejectNewMember = async (
    requester: string,
    clubid: string,
    member: string
  ) => {
    /// auth check
    let clubPresident = await Club.findByPk(clubid).then((r) => {
      if (!r) {
        throw new NotFoundError("CLUB_NOT_FOUND", `${clubid} cannot be found`);
      }
      if (r.president != requester) {
        throw new CustomError(
          "UNAUTHORIZED",
          403,
          `${requester} is not authorized for this task in club ${clubid}`
        );
      }
    });
    let clubMember = await ClubUser.findOne({
      where: { cid: clubid, username: member },
    }).then((r) => {
      if (!r) {
        throw new NotFoundError(
          `MEMBER_NOT_FOUND`,
          `${member} cannot be found in club ${clubid}`
        );
      }
      return r;
    });

    clubMember.destroy();
    clubMember.save();
    return { success: `Rejected ${member} in club ${clubid}` };
  };
}
