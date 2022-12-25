import { Sequelize } from "sequelize-typescript";
import { User } from "../../Auth/Models/User.model";
import CustomError from "../../App/Middlewares/Errors/CustomError";
import { Club } from "../Models/Club.model";
import { ClubUser } from "../Models/ClubUser.model";
import NotFoundError from "../../App/Middlewares/Errors/NotFoundError";

export const banMember = async (
  username: string,
  cid: string,
  requesterUsername: string
) => {
  await Club.findByPk(cid, { include: [User] }).then((r) => {
    if (r?.president != requesterUsername)
      throw new CustomError(
        "UNAUTHORIZED",
        403,
        `${requesterUsername} is not ${cid}'s president`
      );
  });
  let clubMember = await ClubUser.findOne({
    where: {
      cid: cid,
      username: username,
    },
  });

  if (!clubMember)
    throw new NotFoundError(
      "USER_NOT_FOUD",
      `${username} cannot be found in club ${cid}`
    );

  if (clubMember.status != "active")
    throw new CustomError(
      "USER_NOT_BANNED",
      403,
      `${username} is not active in club ${cid}`
    );

  clubMember.update({ status: "banned" });
  clubMember.save();

  return clubMember;
};

export const unbanMember = async (
  username: string,
  cid: string,
  requesterUsername: string
) => {
  await Club.findByPk(cid, { include: [User] }).then((r) => {
    if (r?.president != requesterUsername)
      throw new CustomError(
        "UNAUTHORIZED",
        403,
        `${requesterUsername} is not ${cid}'s president`
      );
  });
  let clubMember = await ClubUser.findOne({
    where: {
      cid: cid,
      username: username,
    },
  });

  if (!clubMember)
    throw new NotFoundError(
      "USER_NOT_FOUD",
      `${username} cannot be found in club ${cid}`
    );

  if (clubMember.status != "banned")
    throw new CustomError(
      "USER_NOT_BANNED",
      403,
      `${username} is not banned in club ${cid}`
    );

  clubMember.update({ status: "active" });
  clubMember.save();

  return clubMember;
};
