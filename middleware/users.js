import jwt from "jsonwebtoken";//token을 얻기 위한 libray
import * as userRepository from "../data/users.js";//회원정보 js
import { config } from "../config.js";
const AUTH_ERROR = { message: "Authentication Error" };
export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");//request에 Authorization에 던져줌
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json(AUTH_ERROR);//만일 비어있다면 token이 없다는 의미
  }
  const token = authHeader.split(" ")[1];//던져준 토큰
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    //토큰정보를 해독 후 에러가 있나?
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    //없다면 decoded된 id로 회원을 찾음
    const user = await userRepository.findId(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR + "??");
    }
    req.token = token;
    req.userInfo = user;
    next();
  });
};
