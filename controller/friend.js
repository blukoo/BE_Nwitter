import * as friendRepository from "../data/friend.js";
import { getSocketIO } from "../connection/socket.js";

export async function getFriend(req, res) {
  const { id } = req.query;
  const data = await friendRepository.getFriend(id);
  res.status(200).json(data);
}
export async function getRequestFriend(req, res) {
  const { id } = req.query;
  const friend = await friendRepository.getRequestFriend(id);
  if (friend) {
    res.status(200).json(friend);
  } else {
    res.status(404).json({ message: `확인해주세요` });
  }
}
export async function getReplyFriend(req, res) {
  const { id } = req.query;
  const friend = await friendRepository.getReplyFriend(id);
  if (friend) {
    res.status(200).json(friend);
  } else {
    res.status(404).json({ message: `확인해주세요` });
  }
}
export async function createFriend(req, res) {
  const { id } = req.params;
  const { requestFriendId, replyFriendId } = req.body;
  const friend = await friendRepository.createFriend(
    requestFriendId,
    replyFriendId
  );
  res.status(201).json(friend);
  getSocketIO().emit("changedFriend", friend);
}
export async function updateFriend(req, res) {
  const { id } = req.params;
  const { isFriend } = req.body;
  const friend = await friendRepository.getById(id);
  if (!friend) {
    return res.status(404).json({ message: `friend not found : ${id}` });
  }
  const updated = await friendRepository.updateFriend(id, isFriend);
  res.status(200).json(updated);
  getSocketIO().emit("changedFriend", friend);
}
export async function deleteFriend(req, res, next) {
  const { id } = req.params;
  const friend = await friendRepository.getById(id);
  if (!friend) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  await friendRepository.deleteFriend(id);
  res.sendStatus(204);
  getSocketIO().emit("changedFriend", friend);
}
//유저랑은 다르게 친구요청이 있는 사용자는 나오지 않도록
export async function getNotConnectFriend(req, res, next) {
  const users = await friendRepository.getNotConnectFriend(
    req.query.nickname,
    req.userInfo.dataValues.id
  );
  return res.status(200).json(users);
}
