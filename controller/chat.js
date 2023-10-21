import * as chatRepository from "../data/chat.js";
// import { getSocketIO } from "../connection/socket.js";

export async function getChat(req, res) {
  const { friendShipId, friendId } = req.query;
  console.log(req.userInfo.dataValues, "data");
  const data = await chatRepository.getChat(
    friendShipId,
    friendId,
    req.userInfo.dataValues.id
  );
  res.status(200).json(data);
}
export async function createChat(req, res) {
  const { friendId } = req.params;
  console.log(friendId, "friendId");
  const chat = await chatRepository.createChat(friendId, req.userInfo.id);
  res.status(201).json(chat);
  // getSocketIO().emit("changedFriend", friend);
}
export async function updateChat(req, res) {
  const { id } = req.params;
  const { chatId, myId, msg } = req.body;
  const chat = await chatRepository.getById(id);
  if (!chat) {
    return res.status(404).json({ message: `chat not found : ${id}` });
  }
  const updated = await chatRepository.updateFriend(chatId, myId, msg);
  res.status(200).json(updated);
  // getSocketIO().emit("changedFriend", friend);
}
export async function deleteChat(req, res, next) {
  const { id } = req.params;
  const friend = await chatRepository.getById(id);
  if (!friend) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  await chatRepository.deleteFriend(id);
  res.sendStatus(204);
  // getSocketIO().emit("changedFriend", friend);
}
//유저랑은 다르게 친구요청이 있는 사용자는 나오지 않도록
export async function getNotConnectFriend(req, res, next) {
  const users = await chatRepository.getNotConnectFriend(
    req.query.nickname,
    req.userInfo.dataValues.id
  );
  return res.status(200).json(users);
}
