import { Sequelize } from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import { Post } from "../Models/Post.model";
import { Club } from "../../Clubs/Models/Club.model";
import sharp from "sharp";

export default class PostService {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    this.db = db;
  }
  // Create post without images
  create = async (payload: Partial<Post>) => {
    if (payload.content == null && payload.imgLink == null) {
      throw new CustomError(
        "INVALID_POST",
        400,
        "Post must include content or picture"
      );
    }
    return await Post.create(payload, {
      include: Club,
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };
  // Create posts with images
  createWithImages = async (
    payload: Partial<Post>,
    files: Express.Multer.File[]
  ) => {
    try {
      let fileName = files[0].originalname;
      const newFileName = `${Date.now()}-${fileName}`;
      await sharp(files[0].buffer)
        .toFile(`Images/${newFileName}`)
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });

      payload.imgLink = newFileName;

      if (payload.content == null && payload.imgLink == null) {
        throw new CustomError(
          "INVALID_POST",
          400,
          "Post must include content or picture"
        );
      }
      const result = await this.db.transaction(async (t) => {
        const newPost = await Post.create(payload, {
          include: Club,
          transaction: t,
        }).catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });

        return newPost;
      });
      return result;
    } catch (error: any) {
      throw new CustomError(error.name, 400, error.message);
    }
  };

  getFeedForUser = async (username: string) => {
    let userClubs = await User.findByPk(username).then((result) => {
      return result?.$get("member").then((clubs) => {
        return clubs.map((club) => {
          return club.clubid;
        });
      });
    });
    console.log(userClubs);

    let result = await Post.findAll({ where: { author: [userClubs] } });
    return result;
  };

  getAll = async () => {
    return await Post.findAll({
      include: {
        model: Club,
        // attributes: ["username", "firstName", "lastName", "role"],
      },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };
}
