import { Router, NextFunction, RequestHandler } from "express";

interface route {
  prefix: string;
  instance: Router;
  middlewares?: RequestHandler[] | RequestHandler;
}

export default interface Irouter {
  routers: route[];
}
