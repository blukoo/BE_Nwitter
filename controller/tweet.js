import * as tweetRepository from "../data/tweet.js";
import { getSocketIO } from '../connection/socket.js';

export async function getTweets(req, res) {
  const userId = req.query.userId;
  const data = await (userId
    ? tweetRepository.getAllByUserId(userId)
    : tweetRepository.getAll());
  res.status(200).json(data);
}
export async function getTweet(req, res) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not Found` });
  }
}
export async function createTweet(req, res) {
  const { image, text } = req.body;
  const tweet = await tweetRepository.create(text, req.userInfo.id);
  res.status(201).json(tweet);
  getSocketIO().emit('getTweets', tweet);
}
export async function updateTweet(req, res) {
  const { id } = req.params;
  const { text, userId } = req.body;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found : ${id}` });
  }
  if (tweet.userId !== userId) {
    return res.sendStatus(403);
  }
  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
  getSocketIO().emit('getTweets', tweet);
}
export async function updateTweetImage(req, res) {
  const { id } = req.params;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found : ${id}` });
  }
  const updated = await tweetRepository.updateImage(id, `/upload/image/${req.file.filename}`);
  res.status(200).json(updated);
  getSocketIO().emit('getTweets', tweet);
}
export async function deleteTweet(req, res, next) {
  const { id } = req.params;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  await tweetRepository.remove(id);
  res.sendStatus(204);
  getSocketIO().emit('getTweets', tweet);
}
