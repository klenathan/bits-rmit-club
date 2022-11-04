import { Sequelize } from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import { Post } from "../Models/Post.model";

export default class PostService {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    this.db = db;
  }

  // craete = async ()

  create = async (payload: Partial<Post>) => {
    return await Post.create(payload, {
      include: User,
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  getAll = async () => {
    return await Post.findAll({
        include: {
          model: User,
            attributes: ['username', 'firstName', 'lastName', 'role']
        }
      })
    .catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };
}
