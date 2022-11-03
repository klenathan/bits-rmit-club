import { Request, Response, NextFunction } from "express";

export const invalidPathHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).send({
    error: "ROUTE_NOT_EXISTED",
    route: req.path,
    message: "The route you are trying to access is not existed!",
  });
};
