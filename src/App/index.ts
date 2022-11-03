import Server from "./server";
import db from "./Models";
// import Auth from "../Auth";
import Irouter from "../Base/Types/routerInterface";

import MailRouter from "../Email/mail.routes";
import AuthPackage from "../Auth";
import { User } from "../Auth/Models/User.model";

import * as crypto from 'crypto'


const PORT = 8080;

const auth = new AuthPackage(db)



// db.addModels([User])


const routerObj: Irouter = {
  routers: [
    // {
    //   prefix: "/product",
    //   middlewares: [verifyToken("access"), verifyUserRole("Admin")],
    //   instance: sale.productRouter,
    // }
    { prefix: "/mail", instance: new MailRouter(db).router},
    { prefix: "/auth", instance: auth.router}
    // { prefix: "/auth", instance: auth.authRoutes },
    // { prefix: "/user", instance: auth.userRoutes },
  ],
};
const server = new Server(PORT, db, routerObj);


db.sync().then(() => {
  console.log(db.models);
  server.start();
});
