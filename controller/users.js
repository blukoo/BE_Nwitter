import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

export async function signup(req, res) {
  const { userId, password, name, email, url } = req.body;
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
  });
  const token = createJwtToken(userInfo);
  res.status(201).json({ token, userId });
}
export async function me(req, res, next) {
  const user = await userRepository.findUserId(req.userInfo.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ token: req.token, userInfo: user });
}
