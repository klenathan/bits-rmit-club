import { Sequelize } from "sequelize-typescript";
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import BaseService from "../../Base/base.service";
import { User } from "../Models/User.model";
import * as crypto from "crypto";
import { Club } from "../../Clubs/Models/Club.model";
import { UserValidator } from "../Models/Validation.model";
import MailService from "../../Email/mail.service";
import sharp from "sharp";

export default class AuthService extends BaseService<User> {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    super(new User());
    this.db = db;
  }

  getAll = async (): Promise<User[]> => {
    return await User.findAll({
      attributes: { exclude: ["password"] },
      include: Club,
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  getUserInfo = async (id: string) => {
    return await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: Club,
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  login = async (
    username: string,
    password: string
  ): Promise<Partial<User>> => {
    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    password = hashPassword;

    return await User.findByPk(username, {
      include: Club,
    }).then((result) => {
      let newRes: any;

      if (result?.password == password) {
        newRes = result?.toJSON();
        delete newRes.password;

        return newRes;
      } else {
        throw new CustomError(
          "WRONG_CREDENTIAL",
          401,
          "Username or password is incorrect"
        );
      }
    });
  };

  validateUser = async (username: string, key: string) => {
    return await UserValidator.findOne({ where: { username: username } })
      .then((result) => {
        if (result?.key == "null") {
          throw new CustomError(
            "USER_VERIFIED",
            400,
            `User ${username} has already been verified`
          );
        } else if (result?.key != key)
          throw new CustomError(
            "WRONG_VERIFICATION_KEY",
            400,
            "Wrong verification key"
          );
        // result.$set('key', null)
        result.update({ key: "null" });
        return true;
      })
      .then((r) => {
        User.update(
          { status: "active" },
          { where: { username: username } }
        ).catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
  };

  signUp = async (
    payload: Partial<User>,
    files: Express.Multer.File[]
  ): Promise<User> => {
    if (payload.password) {
      let password: string = payload.password;

      const newFileName = `avatar-${Date.now()}-${files[0].originalname}`;
      let avatar = files.length == 0 ? "heh.png" : newFileName;
      const hashPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      payload.password = hashPassword;

      let randomToken = (Math.random() + 1)
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      await UserValidator.create({
        username: payload.username,
        key: randomToken,
      })
        .then((result) => {
          if (!payload.email) {
            throw new CustomError("INVALID_EMAIL", 400, "Invalid input email");
          }
          // new MailService().sendVerificationMail(payload.email, randomToken);
        })
        .catch((e) => {
          if (e.name == "SequelizeUniqueConstraintError") {
            throw new CustomError(e.name, 400, "User already existed");
          }
          throw new CustomError(e.name, 400, e.message);
        });

      await sharp(files[0].buffer)
        .toFile(`Images/${newFileName}`)
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });
      payload.avatar = newFileName;

      return await User.create(payload).catch((e) => {
        if (e.name == "SequelizeUniqueConstraintError") {
          throw new CustomError(e.name, 400, "User already existed");
        }
        throw new CustomError(e.name, 400, e.message);
      });
    } else {
      throw new CustomError(
        "PASSWORD_DOES_NOT_EXIST_ON_PAYLOAD",
        400,
        "password is missing from payload"
      );
    }
  };

  updateUser = async (
    username: string,
    payload: Partial<User>
  ): Promise<User[] | any> => {
    const result = await User.update(payload, {
      where: { username: username },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    if (result[0] == 0) {
      throw new NotFoundError(
        "USER_NOT_FOUND",
        `Unable to find user ${username}`
      );
    }

    return result;
  };

  updateAvatar = async (file: Express.Multer.File): Promise<string> => {
    const newFileName = `avatar-${Date.now()}-${file.originalname}`;

    return await sharp(file.buffer)
      .toFile(`Images/${newFileName}`)
      .then(r => {
        return newFileName;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    
  };
}
