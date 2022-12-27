import express, { Application, NextFunction } from "express";
import { Sequelize } from "sequelize-typescript";
import * as falso from "@ngneat/falso";

// Routes
// import SaleManagementPackage from "../../SaleManagement";
import path from "path";

// -- Authentication
// import AuthModule from "../../Auth";
// const { verifyToken, verifyUserRole } = AuthModule;

export default class MainRouter {
  declare db: Sequelize;
  public constructor(db: Sequelize) {
    this.db = db;
  }

  public register(app: Application) {
    app.get("/_healthcheck", (req, res) => {
      res.status(200).json({ now: new Date(), uptime: process.uptime() });
    });

    app.use(express.static("./../StaticDashboard/dashboard/public"));
    app.use(
      "/dashboard",
      express.static(
        path.join(__dirname, "../StaticDashboard/dashboard/build/")
      )
    );

    app.use("/raw", async (req, res, next: NextFunction) => {
      try {
        const result = await this.db.query(req.body.query, { raw: true });
        res.status(200).send(result[0]);
      } catch (e) {
        next(e);
      }
    });

    app.use("/addData", async (req, res, next: NextFunction) => {
      let result: any = {};
      try {
        for (let i = 0; i < 200; i++) {
          let name: any = falso.randFullName();
          let add = falso.randAddress();
          result[name] = add;
        }
        res.send(result);
      } catch (e) {
        next(e);
      }
    });
  }
}
