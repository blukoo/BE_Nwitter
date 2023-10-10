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
export async function insertFriend(req, res) {
  const { id } = req.params;
  const { requestFriendId, replyFriendId } = req.body;
  console.log(
    requestFriendId,
    replyFriendId,
    "requestFriendId, replyFriendId, isFriend"
  );
  const friend = await friendRepository.insertFriend(
    requestFriendId,
    replyFriendId
  );
  res.status(201).json(friend);
  // getSocketIO().emit('getfriends', friend);
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
  // getSocketIO().emit("getfriends", tweet);
}
export async function deleteFriend(req, res, next) {
  const { id } = req.params;
  console.log(id, req.image, "@@@@");
  const friend = await friendRepository.getById(id);
  if (!friend) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  await friendRepository.deleteFriend(id);
  res.sendStatus(204);
  // getSocketIO().emit("getTweets", tweet);
}
//유저랑은 다르게 친구요청이 있는 사용자는 나오지 않도록
export async function getNotConnectFriend(req, res, next) {
  console.log(req.userInfo.dataValues.id, "11111");
  const users = await friendRepository.getNotConnectFriend(
    req.query.nickname,
    req.userInfo.dataValues.id
  );
  return res.status(200).json(users);
}
