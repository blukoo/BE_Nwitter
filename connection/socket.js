import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error("Authentication Error"));
        }
        next();
      });
    });
    this.io.on("connect", (socket) => {
      socket.on("add user", (username) => {
        console.log("Socket client connected");
      });
      socket.on("saveTweets", (socket) => {
        console.log("tweetssocket");
      });
    });
  }
}
let socket;
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}
export function getSocketIO() {
  if (!socket) {
    throw new Error("Please call init first");
  }
  console.log("conneted tweets");
  return socket.io;
}
