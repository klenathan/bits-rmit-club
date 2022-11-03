import CustomError from "../CustomError";
import { Request, Response, NextFunction } from "express";
import NotFoundError from "../NotFoundError";

export const handleError = (
  err: Error | CustomError | TypeError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = err;

  if (err instanceof Error) {
    let newError = new CustomError("Server Error", 500, err.message);
    return res.status(500).send(newError);
  }

  return res.status((customError as CustomError).status).send(customError);
};
