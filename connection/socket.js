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
          return next(new Error("Authentication Erroraaaaaa"));
        }
        next();
      });
    });
    let chatConnected = new Set()
    this.io.on("connect", (socket) => {
      socket.on("add user", (username) => {
        console.log("Socket client connected");
      });
      socket.on("saveTweets", (socket) => {
        console.log("tweetssocket");
      });
      socket.on("changeFriend", (socket) => {
        console.log("friendsocket");
      });
      socket.on("sendMessage", (chatId) => {
        console.log("socket", chatId);
        // socket.join(chatId);
      });
      socket.on("enter_chat", async (chatInfo) => {
        chatConnected.add(chatInfo.userId)
        console.log("enter_chat 들어옴!!!!!", chatInfo.nickname,chatInfo.id,"chatInfo.id");
        await socket.join(chatInfo.id);
        socket.to(chatInfo.id).emit("welcome",[...chatConnected])
      });
      socket.on("out_chat", (chatInfo) => {
        chatConnected.delete(chatInfo.userId)
        console.log("out_chat 나감!!!!!", chatInfo,chatConnected);
        socket.leave(chatInfo.id);
        socket.to(chatInfo.id).emit("bye",[...chatConnected])
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
