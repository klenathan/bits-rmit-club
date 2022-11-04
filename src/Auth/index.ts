import { Router } from "express"

import { Sequelize } from "sequelize-typescript";
import { User } from "./Models/User.model";
import AuthRouter from "./Routes/auth.routes";

export default class AuthPackage {
    declare router: Router
    constructor (db: Sequelize) {
        
        this.router = new AuthRouter(db).routes
    }
}