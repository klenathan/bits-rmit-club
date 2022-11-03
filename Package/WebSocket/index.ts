import { Server } from "socket.io";
import https from "https";
import http, { createServer } from "http";

export default class WS {
  declare httpServer: http.Server | https.Server ;
  declare io: Server

  constructor(httpServer?: http.Server | https.Server) {
    if (httpServer) this.httpServer = httpServer;
    this.io = new Server(this.httpServer);
  }

  test() {
    this.io.on("connection", (socket) => {
      let userData: any = {};

      console.log(this.io.engine.clientsCount);

      socket.on("chat message", (msg) => {
        console.log(msg);

        if (msg.msg == "go") {
          for (let j = 0; j < 10; j++) {
            let sendData = `${msg.username}: ${msg.msg} - ${j}`;
            socket.emit("server", `${sendData}`);
            socket.broadcast.emit("server", `${sendData}`);
          }
        } else {
          let sendData = `${msg.username}: ${msg.msg}`;
          socket.emit("server", `${sendData}`);
          socket.broadcast.emit("server", `${sendData}`);
        }
      });
    });
  }
}
