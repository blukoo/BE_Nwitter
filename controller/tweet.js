import * as tweetRepository from "../data/tweet.js";
export async function getTweets(req, res) {
  console.log(req.query,"@@@")
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
  const { text } = req.body;
  const tweet = await tweetRepository.create(text, req.userInfo.id);
  res.status(201).json(tweet);
}
export async function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found : ${id}` });
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
}
export async function deleteTweet(req, res, next) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await tweetRepository.remove(id);
  res.sendStatus(204);
}
