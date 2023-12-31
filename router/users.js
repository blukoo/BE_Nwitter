import express from "express";
import { body } from "express-validator"; //validate할 대상
import * as usersController from "../controller/users.js";
import { isAuth } from "../middleware/users.js";
const router = express.Router();
const validateCredential = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("userId should be at least 5 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
];

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
];
router.post("/signup", validateSignup, usersController.signup);

router.post("/login", validateCredential, usersController.login);
router.post("/kakao_signup", validateSignup, usersController.kakaoSignup);
router.post("/kakao_login", validateCredential, usersController.kakaoLogin);
router.get("/check_duplicate_id", usersController.checkDuplicateId);
router.get("/find_user", usersController.findUser);
router.get("/find_kakao_user", usersController.findKakaoUser);
router.get("/me", isAuth, usersController.me);
export default router;
