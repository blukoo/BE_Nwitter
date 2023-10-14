import express from "express";
import "express-async-errors";
import * as chatController from "../controller/chat.js";
import { isAuth } from "../middleware/users.js";
const router = express.Router();
router.get("/", isAuth, chatController.getChat);
// GET /tweets/:id
router.post("/reply", isAuth, chatController.createChat);

// POST /tweeets
router.post("/", isAuth, chatController.createChat);

// PUT /tweets/:id
router.put("/:id", isAuth, chatController.updateChat);

// DELETE /tweets/:id
router.delete("/:id", isAuth, chatController.deleteChat);

export default router;
