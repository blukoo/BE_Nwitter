import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan"; //log 제공용
import helmet from "helmet";
import usersRoute from "./router/users.js";
import tweetsRoute from "./router/tweets.js";
import { sequelize } from "./db/database.js";
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/tweets", tweetsRoute);
app.use("/users", usersRoute);
app.use('/upload/image/', express.static('upload/image/'))
app.use((req, res, next) => {
  res.sendStatus(404);
});
app.use((error, req, res, next) => {
  console.error(error, "err");
  res.sendStatus(500);
});
sequelize.sync().then(client=>{
  // console.log(client,"client")
})
app.listen(8080, (PORT) => {
  console.log(`Server running on port ${PORT}`);
});
