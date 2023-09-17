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
  const user = await userRepository.findByUserId(userId);
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
  const { kakaoId, password } = req.body;
  console.log(kakaoId, password, "@@@@@@@@@");
  const user = await userRepository.findByKakaoId(kakaoId);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, kakaoId });
}
export async function signup(req, res) {
  let { userId, password, name, email, url, nickname, kakaoId } = req.body;
  let found;
  found = await userRepository.findById(userId);
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
    nickname,
    kakaoId,
  });
  const token = createJwtToken(userInfo);
  res.status(201).json({ token, userId });
}
export async function kakaoSignup(req, res) {
  let { userId, password, name, email, url, nickname, kakaoId } = req.body;
  let found;
  let token;
  found = await userRepository.findByKakaoId(kakaoId);
  if (!found) {
    const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const userInfo = await userRepository.createUser({
      userId,
      password: hashed,
      name,
      email,
      url,
      nickname,
      kakaoId,
    });
    token = createJwtToken(userInfo);
  }
  res.status(201).json({ token, userId });
}
export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ token: req.token, userInfo: user });
}
export async function findUser(req, res, next) {
  console.log(req, req.userId, req.userInfo, req.query.userId, "11111");
  const user = await userRepository.findById(req.query.userId);
  if (!user) {
    return res.status(200).json({ userInfo: { userId: null } });
  }
  return res.status(200).json({ token: req.token, userInfo: user });
}
