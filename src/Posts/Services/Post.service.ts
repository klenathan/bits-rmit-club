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
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";
import { NewNotiUtil } from "../../Base/Utils/notiEvent";
import { ClubEvent } from "../Models/Event.model";

export default class PostService {
  declare db: Sequelize;
  constructor(db: Sequelize) {
    this.db = db;
  }

  authorizationCheck = async (username: string, clubId: string) => {
    let club = await ClubUser.findOne({
      where: { cid: clubId, username: username },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    if (!club)
      throw new CustomError("CLUB_NOT_FOUND", 404, `${clubId} cannot be found`);
    // console.log(club);

    if (club.role != "president") {
      throw new CustomError(
        "UNAUTHORIZED",
        403,
        `${username} is not authorized to take action on club id ${clubId}`
      );
    }
    return true;
  };

  contentAuthorizationCheck = async (username: string, clubId: string) => {
    let club = await ClubUser.findOne({
      where: { cid: clubId, username: username },
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    if (!club)
      throw new CustomError("CLUB_NOT_FOUND", 404, `${clubId} cannot be found`);
    // console.log(club);

    if (club.role != "president" && club.role != "contentWriter") {
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
    let post = await Post.create(payload, {
      include: Club,
    })
      .then((r) => {
        this.notiForClubMember(r.postAuthor, r.id);
        return r;
      })
      .catch((e) => {
        console.log(e);
        throw new CustomError(e.name, 400, e.message);
      });

    return post;
  };
  // Create posts with images
  createWithImages = async (
    payload: Partial<Post>,
    files: Express.Multer.File[]
  ) => {
    try {
      // console.log("generating");

      payload.imgLink = [];
      for (let file of files) {
        let fileName = file.originalname;
        const newFileName = `postIMG-${Date.now()}-${fileName}`;
        // Write file to database (")> if we have one
        await sharp(file.buffer)
          .toFile(`Images/${newFileName}`)
          .catch((e) => {
            throw new CustomError(e.name, 400, e.message);
          });
        payload.imgLink.push(newFileName);
      }

      if (payload.content == null && payload.imgLink.length == 0) {
        throw new CustomError(
          "INVALID_POST",
          400,
          "Post must include content or picture"
        );
      }
      // const result = await this.db.transaction(async (t) => {
      const newPost = await Post.create(payload, {
        include: [Club],
        // transaction: t,
      })
        .then(async (r) => {
          // let result = r
          let club = await r.$get("postAuthor");
          if (club) {
            // console.log(club.clubid);
            this.notiForClubMember(club, r.id);
          }
          // console.log()
          return r;
        })
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });
      return newPost;
    } catch (error: any) {
      throw new CustomError(error.name, 400, error.message);
    }
  };

  updatePost = async (id: string, payload: Partial<Post>, username: string) => {
    // console.log(id);
    await this.contentAuthorizationCheck(username, id);
    let post = await Post.findByPk(id).catch(e => {
      throw new CustomError(e.name, 400, e.message)
    });
    if (!post)
      throw new NotFoundError("POST_NOT_FOUND", `${id} cannot be found`);

    post.update(payload);
    post.save();

    return post;
  };

  // LikePost
  likePost = async (postID: string, userID: string) => {
    let post = await Post.findByPk(postID, { include: [Club] }).catch((e) => {
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

    let postAuthor: Club = post.postAuthor;

    return await post
      .$add("likes", userID)
      .then((r) => {
        this.notifyNewLike(postAuthor, userID, postID);
        return r;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
  };

  notifyNewLike = async (club: Club, username: string, post: string) => {
    let user = await User.findByPk(username);
    let content = `${user?.firstName} ${user?.lastName} has like ${club.name}'s post`;
    console.log(content);

    return await NewNotiUtil(
      club.president,
      content,
      `post:${post}`,
      "post_like",
      user?.avatar
    );
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
      order: [["createdAt", "DESC"]],
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
    return result;
  };

  getClubFeed = async (id: string) => {
    return await Post.findAll({
      where: { author: id },
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
      order: [["createdAt", "DESC"]],
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  getByPk = async (id: string) => {
    return await Post.findByPk(id, {
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
    })
      .then((result) => {
        if (result == null) {
          throw new CustomError("NOT_FOUND", 404, `Post ${id} not found`);
        }
        return result;
      })
      .catch((e) => {
        throw new CustomError(e.name, 400, e.message);
      });
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
      { include: [Post, User] }
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
      order: [["createdAt", "DESC"]],
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });
  };

  deletePost = async (user: string, postID: string) => {
    let post = await Post.findByPk(postID, {
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
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    if (!post)
      throw new NotFoundError("NOT_FOUND", `Post ${postID} cannot be found`);
    let id = post.id;
    if (await this.authorizationCheck(user, post.author)) {
      return await post
        .destroy()
        .then((r) => {
          return { message: `deleted post ${id}` };
        })
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });
    }
    return { message: "UNKNOWN_ERR" };
  };

  notiForClubMember = async (club: Club, pid: string) => {
    let content = `${club.name} has posted a new post, check out now`;
    let members = await club.$get("member");
    let memberUsername = members.map((mem) => {
      return mem.username;
    });
    await NewNotiUtil(
      memberUsername,
      content,
      `post:${pid}`,
      "new_post",
      club.avatar
    );
  };

  getAllEvent = async (username: string) => {
    let userClubs = await User.findByPk(username, { include: [Club] });
    userClubs?.member.forEach((club) => {
      console.log(club.clubid);
    });

    let clubArr = userClubs?.member.map((club) => club.clubid);

    // console.log(clubArr);

    let events = await ClubEvent.findAll({
      where: { startDate: { [Op.gte]: Date() }, author: clubArr },
      include: Club,
    }).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    return events;
  };

  notiEventForClubMember = async (club: Club, pid: string) => {
    let content = `${club.name} has a new event, check out now`;
    let members = await club.$get("member");
    let memberUsername = members.map((mem) => {
      return mem.username;
    });
    await NewNotiUtil(
      memberUsername,
      content,
      `event:${pid}`,
      "new_event",
      club.avatar
    );
  };

  createEvent = async (payload: Partial<ClubEvent>) => {
    if (payload.content == null && payload.imgLink == null) {
      throw new CustomError(
        "INVALID_EVENT",
        400,
        "Event must include content or picture"
      );
    }
    let post = await ClubEvent.create(payload, {
      include: Club,
    })
      .then((r) => {
        this.notiForClubMember(r.eventAuthor, r.id);
        return r;
      })
      .catch((e) => {
        console.log(e);
        throw new CustomError(e.name, 400, e.message);
      });

    return post;
  };
  // Create event with images
  createEventWithImages = async (
    payload: Partial<ClubEvent>,
    files: Express.Multer.File[]
  ) => {
    try {
      payload.imgLink = [];
      for (let file of files) {
        let fileName = file.originalname;
        const newFileName = `eventIMG-${Date.now()}-${fileName}`;
        // Write file to database (")> if we have one
        await sharp(file.buffer)
          .toFile(`Images/${newFileName}`)
          .catch((e) => {
            throw new CustomError(e.name, 400, e.message);
          });
        payload.imgLink.push(newFileName);
      }

      if (payload.content == null && payload.imgLink.length == 0) {
        throw new CustomError(
          "INVALID_EventT",
          400,
          "Event must include content or picture"
        );
      }
      const newEvent = await ClubEvent.create(payload, {
        include: [Club],
      })
        .then(async (r) => {
          let club = await r.$get("eventAuthor");
          if (club) {
            this.notiEventForClubMember(club, r.id);
          }
          return r;
        })
        .catch((e) => {
          throw new CustomError(e.name, 400, e.message);
        });
      return newEvent;
    } catch (error: any) {
      throw new CustomError(error.name, 400, error.message);
    }
  };

  updateEvent = async (id: string, payload: Partial<ClubEvent>) => {
    let clubEvent = await ClubEvent.findByPk(id).catch((e) => {
      throw new CustomError(e.name, 400, e.message);
    });

    if (!clubEvent) {
      throw new NotFoundError("NOT_FOUND", `Event ${id} cannot be found`);
    }

    let result = await ClubEvent.update(payload, { where: { id: id } });

    return result;
  };

  getClubImages = async (clubid: string, limit: number) => {
    let result: string[] = [];
    let counter = 0;
    let allPosts = await Post.findAll({
      where: {
        author: clubid,
      },
      include: [Club],
    });
    for (let post of allPosts) {
      if (counter >= limit) {
        break;
      } else if (counter + post.imgLink.length > limit) {
        let remaining = counter + post.imgLink.length - limit;

        for (let i = 0; i < remaining; i++) {
          result = [...result, post.imgLink[i]];
        }
      } else if (post.imgLink.length != 0) {
        result = [...result, ...post.imgLink];
        counter += post.imgLink.length;
      }
    }
    return result;
  };
}
