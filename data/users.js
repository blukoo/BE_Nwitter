import { config } from "../config.js";
import { db } from "../db/database.js";
export async function findUserId(id) {
  return await db
    .execute("SELECT * FROM users WHERE userId=?", [id])
    .then((res) => res[0][0]);
}
export async function findId(id) {
  let res = await db.execute("SELECT * FROM users WHERE id=?", [id]);
  return await db
    .execute("SELECT * FROM users WHERE id=?", [id])
    .then((res) => res[0][0]);
}
export async function createUser(user) {
  const { userId, password, name, email, url, nickname } = user;
  console.log(user,"user")
  return db
    .execute(
      "INSERT INTO users (userId, password, name, email, url, nickname) VALUES (?,?,?,?,?,?)",
      [userId, password, name, email, url, nickname]
    )
    .then((res) => res[0].insertId);
}
