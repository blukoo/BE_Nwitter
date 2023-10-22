import * as chatRepository from "../data/chat.js";
// import { getSocketIO } from "../connection/socket.js";

export async function getChat(req, res) {
  const { friendShipId, friendId } = req.query;
  console.log(req.userInfo.dataValues, "data");
  const data = await chatRepository.getChat({
    friendShipId,
    friendId,
    myId: req.userInfo.dataValues.id,
  });
  res.status(200).json(data);
}
export async function createChat(req, res) {
  const { friendId } = req.body;
  console.log(friendId, "friendId");
  const chat = await chatRepository.createChat(friendId, req.userInfo.id);
  res.status(201).json(chat);
  // getSocketIO().emit("changedFriend", friend);
}
export async function updateChat(req, res) {
  const { chatId } = req.params;
  const { friendId, message } = req.body;
  console.log(chatId, "@@@@");
  const chat = await chatRepository.getChat({
    chatId
  }
  );
  if (!chat) {
    return res.status(404).json({ message: `chat not found : ${id}` });
  }
  const updated = await chatRepository.updateChat(
    chatId,
    req.userInfo.dataValues.id,
    message
  );
  res.status(200).json(updated);
  // getSocketIO().emit("changedFriend", friend);
}
export async function deleteChat(req, res, next) {
  const { id } = req.params;
  const chat = await chatRepository.getChat(id);
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
