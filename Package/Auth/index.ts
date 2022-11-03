import AuthRoutes from "./Routes/auth.routes";
import UserRoutes from "./Routes/user.routes";
import { verifyToken } from "./Middlewares/verifyToken";
import { verifyUserRole } from "./Middlewares/verifyRole";
import { Application, Router } from "express";
import { Sequelize } from "sequelize-typescript";
import { RefreshToken, User } from "./Models";

/**
 * Init this class will create models, routes for user authentication
 */
class AuthPackage {
  /**
   * Routes for authentication
   */
  public authRoutes: Router;
  /**
   * Routes for user CRUD
   */
  public userRoutes: Router;
  /**
   * @constructor
   * @param db - Database (sequelize) instance
   */
  constructor(db: Sequelize) {
    db.addModels([RefreshToken, User]);
    this.authRoutes = new AuthRoutes(db).router;
    this.userRoutes = new UserRoutes(db).router;
  }
}

export default {
  AuthPackage,
  verifyToken,
  verifyUserRole,
};
