import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan"; //log 제공용
import helmet from "helmet";
import usersRoute from "./router/users.js";
import tweetsRoute from "./router/tweets.js";
import friendRoute from "./router/friend.js";
import { sequelize } from "./db/database.js";
import { initSocket } from "./connection/socket.js";
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "*", // 모든 출처 허용 옵션. true 를 써도 된다.
  })
);
app.use(
  cors({
    origin: true, // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  })
);
app.use("/tweets", tweetsRoute);
app.use("/users", usersRoute);
app.use("/friend", friendRoute);
app.use("/upload/image/", express.static("upload/image/"));
app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.error(error, "err");
  res.sendStatus(500);
});
sequelize.sync().then((client) => {
  // console.log(client,"client")
});
let server = app.listen(8080, (PORT) => {
  console.log(`Server running on port ${PORT}`);
});
initSocket(server);
