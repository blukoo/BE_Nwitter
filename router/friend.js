import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import * as friendController from "../controller/friend.js";
import { isAuth } from "../middleware/users.js";
import { validate } from "../middleware/validator.js";
const router = express.Router();
// GET /tweet
// GET /tweets?username=:username
router.get("/", isAuth, friendController.getFriend);

// GET /tweets/:id
router.get("/request", isAuth, friendController.getRequestFriend);
// GET /tweets/:id
router.get("/reply", isAuth, friendController.getReplyFriend);

// POST /tweeets
router.post("/:id", isAuth, friendController.insertFriend);

// PUT /tweets/:id
router.put("/:id", isAuth, friendController.updateFriend);

// DELETE /tweets/:id
router.delete("/:id", isAuth, friendController.deleteFriend);

export default router;
