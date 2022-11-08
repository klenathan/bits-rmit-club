import { CreatedAt, Sequelize } from "sequelize-typescript";
import { fn, col, Op } from "sequelize";
import { User } from "../../Auth/Models/User.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import { Post } from "../Models/Post.model";
import { Club } from "../../Clubs/Models/Club.model";
import sharp from "sharp";
import { PostLike } from "../Models/PostLike.model";
import { PostComment } from "../Models/Comment.model";
import { ClubUser } from "../../Clubs/Models/ClubUser.model";

export default class PostService {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    this.db = db;
  }

  authorizationCheck = async (username: string, clubId: string) => {
    let club = await ClubUser.findAll({
      where: { cid: clubId, username: username },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    if (club[0].role != "admin") {
      throw new CustomError(
        "UNAUTHORIZED",
        403,
        `${username} is not authorized to take action on club id ${clubId}`
      );
    }
    return true;
  };

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
      console.log(e);
      
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
      const newFileName = `postIMG-${Date.now()}-${fileName}`;
      // Write file to database (")> if we have one
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

  // LikePost
  likePost = async (postID: string, userID: string) => {
    let post = await Post.findByPk(postID).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    if (!post)
      throw new CustomError("POST_NOT_FOUND", 404, `${postID} not found`);

    let likes = await PostLike.findAndCountAll({
      where: { uID: userID, pID: postID },
    });
    if (likes.count != 0) {
      throw new CustomError(
        "USER_LIKED",
        400,
        `${userID} already liked post ${postID}`
      );
    }

    return await post.$add("likes", userID).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  removeLikePost = async (postID: string, userID: string) => {
    let post = await Post.findByPk(postID).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    if (!post)
      throw new CustomError("POST_NOT_FOUND", 404, `${postID} not found`);

    let likes = await PostLike.findAndCountAll({
      where: { uID: userID, pID: postID },
    });
    if (likes.count == 0) {
      throw new CustomError(
        "USER_NOT_LIKED",
        400,
        `${userID} does not liked post ${postID}`
      );
    }

    return await post.$remove("likes", userID).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  getFeedForUser = async (username: string) => {
    let userClubs = await User.findByPk(username, { include: Club })
      .then((result) => {
        if (!result)
          throw new CustomError("USER_NOT_FOUND", 404, `${username} not found`);
        return result.member.map((club) => club.clubid);
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });

    let result = await Post.findAll({
      where: { author: userClubs },
      include: [
        Club,
        {
          model: PostComment,
          include: [
            {
              model: User,
              attributes: { exclude: ["password"] },
            },
          ],
        },
        {
          model: User,
          attributes: { exclude: ["password"] },
          through: {
            attributes: [],
          },
        },
      ],
      order: ["createdAt"],
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    return result;
  };
  // Comments
  createComment = async (postID: string, username: string, comment: string) => {
    let postResult = await Post.findByPk(postID)
      .then((postQuery) => {
        if (!postQuery)
          throw new CustomError("POST_NOT_FOUND", 404, `${postID} not found`);
        return postQuery;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
    let newComment = await PostComment.create(
      {
        comment: comment,
        postID: postID,
        username: username,
      },
      { include: [Post] }
    ).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    return newComment;
  };

  getAll = async () => {
    return await Post.findAll({
      include: [
        Club,
        {
          model: PostComment,
          include: [
            {
              model: User,
              attributes: { exclude: ["password"] },
            },
          ],
        },
        {
          model: User,
          attributes: { exclude: ["password"] },
          through: {
            attributes: [],
          },
        },
      ],
      order: ["createdAt"],
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };
}
