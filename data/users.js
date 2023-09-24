import SQ from "sequelize";
import { sequelize } from "../db/database.js";
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
    },
    url: DataTypes.TEXT,
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    kakaoId: DataTypes.TEXT,
  },
  { timestamps: false }
);

export async function findById(id) {
  return User.findByPk(id);
}
export async function findByUserId(userId) {
  return User.findOne({ where: { userId } });
}

export async function findByKakaoId(kakaoId) {
  return User.findOne({ where: { kakaoId } });
}
export async function createUser(user) {
  return User.create(user).then((data) => data.dataValues.userId);
}

// import { config } from "../config.js";
// import { db } from "../db/database.js";
// export async function findUserId(id) {
//   return await db
//     .execute("SELECT * FROM users WHERE userId=?", [id])
//     .then((res) => res[0][0]);
// }
// export async function findId(id) {
//   let res = await db.execute("SELECT * FROM users WHERE id=?", [id]);
//   return await db
//     .execute("SELECT * FROM users WHERE id=?", [id])
//     .then((res) => res[0][0]);
// }
// export async function createUser(user) {
//   const { userId, password, name, email, url, nickname } = user;
//   console.log(user,"user")
//   return db
//     .execute(
//       "INSERT INTO users (userId, password, name, email, url, nickname) VALUES (?,?,?,?,?,?)",
//       [userId, password, name, email, url, nickname]
//     )
//     .then((res) => res[0].insertId);
// }
