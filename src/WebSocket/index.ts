import { Server, Socket } from "socket.io";
import https from "https";
import http, { createServer } from "http";
import CustomError from "../App/Middlewares/Errors/CustomError";
import NotFoundError from "../App/Middlewares/Errors/NotFoundError";

interface user {
  username: string;
  socket: string[];
}

export default class WS {
  declare httpServer: http.Server | https.Server;
  declare io: Server;

  declare currentLobby: any;

  constructor(httpServer?: http.Server | https.Server) {
    if (httpServer) this.httpServer = httpServer;
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
      },
    });
    this.currentLobby = {};
  }

  test() {
    this.io.on("connection", (socket) => {
      let username = socket.handshake.query.loggeduser;
      // console.log(username);

      if (!username) {
        throw new Error("no username found");
        console.log("no username found");
      } else if (typeof username != "string") {
        throw new Error("username not string");
        console.log("username not string");
      } else {
        if (!(username in this.currentLobby)) {
          this.currentLobby[username] = {};
        }
        // console.log(this.currentLobby[username]["sockets"]);

        if (!this.currentLobby[username]["sockets"]) {
          this.currentLobby[username]["sockets"] = [];
          this.currentLobby[username]["sockets"].push(socket.id);
        } else {
          this.currentLobby[username]["sockets"].push(socket.id);
        }

        /// EVENTS
        this.io.emit("updateOnlineList", Object.keys(this.currentLobby));

        this.io.emit(
          "connectionChange",
          `${username} has connected, ${JSON.stringify(this.currentLobby)}`
        );

        console.log(
          `${socket.id} connected with name ${username} | ${this.io.engine.clientsCount} | `
        );

        socket.on("chat message", (msg) => {
          // this.notification("admin");
          console.log(msg);

          let sendData = { username: username, msg: msg.msg };
          socket.emit("server", sendData);
          socket.broadcast.emit("server", sendData);
        });

        socket.on("disconnect", (msg) => {
          if (!username) {
            throw new Error("no username found");
          } else if (typeof username != "string") {
            throw new Error("username not string");
          }
          const index = this.currentLobby[username]["sockets"].indexOf(
            socket.id,
            0
          );
          this.currentLobby[username]["sockets"].pop(index);
          if (this.currentLobby[username]["sockets"].length == 0) {
            delete this.currentLobby[username];
          }
          this.io.emit("connectionChange", `${username} has disconnected`);
          this.io.emit("updateOnlineList", Object.keys(this.currentLobby));
        });
      }
      // username = 'test'
    });
  }

  notification(receiver: string, payload: any) {
    if (!(receiver in this.currentLobby)) {
      // console.log();
      console.log("receiver is not in lobby", this.currentLobby);
      
      return;
    }

    this.currentLobby[receiver]["sockets"].map((socket: string) => {
      this.io.to(socket).emit("notification", payload);
    });
  }
}
