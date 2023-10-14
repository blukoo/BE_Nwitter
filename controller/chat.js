import * as chatRepository from "../data/chat.js";
import { getSocketIO } from "../connection/socket.js";

export async function getChat(req, res) {
  const { friendId, myId } = req.query;
  console.log(req.userInfo,"req.userInfo이봐봐봐")
  const data = await chatRepository.getChat(friendId, myId);
  res.status(200).json(data);
}
export async function createChat(req, res) {
  const { id } = req.params;
  const { requestFriendId, replyFriendId } = req.body;
  console.log(req.userInfo,"req.userInfo이봐봐봐")
  console.log(
    requestFriendId,
    replyFriendId,
    "requestFriendId, replyFriendId, isFriend"
  );
  const friend = await chatRepository.createFriend(
    requestFriendId,
    replyFriendId
  );
  res.status(201).json(friend);
  getSocketIO().emit("changedFriend", friend);
}
export async function updateChat(req, res) {
  console.log(req.userInfo,"req.userInfo이봐봐봐")
  const { id } = req.params;
  const { chatId, myId, msg } = req.body;
  const chat = await chatRepository.getById(id);
  if (!chat) {
    return res.status(404).json({ message: `chat not found : ${id}` });
  }
  const updated = await chatRepository.updateFriend(chatId, myId, msg);
  res.status(200).json(updated);
  getSocketIO().emit("changedFriend", friend);
}
export async function deleteChat(req, res, next) {
  const { id } = req.params;
  console.log(id, req.image, "@@@@");
  const friend = await chatRepository.getById(id);
  if (!friend) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  await chatRepository.deleteFriend(id);
  res.sendStatus(204);
  getSocketIO().emit("changedFriend", friend);
}
//유저랑은 다르게 친구요청이 있는 사용자는 나오지 않도록
export async function getNotConnectFriend(req, res, next) {
  console.log(req.userInfo.dataValues.id, "11111");
  const users = await chatRepository.getNotConnectFriend(
    req.query.nickname,
    req.userInfo.dataValues.id
  );
  return res.status(200).json(users);
}
