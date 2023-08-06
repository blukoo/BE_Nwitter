import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";
import qs from "qs";
import {} from "express-async-errors";
import * as userRepository from "../data/users.js";
import { config } from "../config.js";
function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expireInSec,
  });
}
export async function login(req, res) {
  const { userId, password } = req.body;
  console.log(userId, password, "@@@@@@@@@");
  const user = await userRepository.findUserId(userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, userId });
}

export async function kakaoLogin(req, res) {
  let { code } = req.body;
  const kakaoKey = config.kakao.key; //REST API KEY
  const redirectUri = config.kakao.redirect_url; //Redirect URI
  // console.log(req.params, req.body, "@@@@@@@@@@@@@@@@@@@@@");
  try {
    const config = {
      grant_type: "authorization_code", //특정 스트링
      client_id: kakaoKey,
      redirectUri: redirectUri,
      code: code, //결과값을 반환했다. 안됐다.
    };
    const params = new URLSearchParams(config).toString();
    let token = await axios.get({
      baseUrl: `https://kauth.kakao.com/oauth/token?${params}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      }, //객체를 string 으로 변환
    });

    console.log(token);
    return res.status(200).json({ token });
  } catch (e) {
    console.log(e, "error입니다");
    return res.status(500);
  }
}
export async function signup(req, res) {
  let { userId, password, name, email, url, nickname, kakaoId } = req.body;
  if(kakaoId&& !userId){
    userId = kakaoId
  }
  const found = await userRepository.findUserId(userId);
  if (found) {
    return res.status(409).json({ message: `${userId} already exists` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userInfo = await userRepository.createUser({
    userId,
    password: hashed,
    name,
    email,
    url,
    nickname
  });
  const token = createJwtToken(userInfo);
  res.status(201).json({ token, userId });
}
export async function me(req, res, next) {
  const user = await userRepository.findUserId(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ token: req.token, userInfo: user });
}
export async function findUser(req, res, next) {
  console.log(req,req.userId,req.userInfo,req.query.userId,"11111")
  const user = await userRepository.findUserId(req.query.userId);
  if (!user) {
    return res.status(200).json({ userInfo:{userId:null} });
  }
  return res.status(200).json({ token: req.token, userInfo: user });
}
