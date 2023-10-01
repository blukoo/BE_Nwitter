import { db } from "../db/database.js";
import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { User,findByUserId } from "./users.js";
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;
const Tweet = sequelize.define("tweet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
  },
});
Tweet.belongsTo(User);
const INCLUDE_USER = {
  attributes: [
    "id",
    "text",
    "createdAt",
    "userId",
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.nickname"), "nickname"],
    [Sequelize.col("user.url"), "url"],
  ], 
  include: {
    model: User,
    attributes: [
      // "name",
      // "nickname",
      // "url",
      
    ],
    // attributes: ["name","nickname"],
    // required: false,
  },
};

const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};

export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}
export async function getAllByNickname(nickname) {
  console.log(nickname,"nick")
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include:{ ...INCLUDE_USER.include,
      where: { nickname } 
    },
  });
}
export async function getAllByUserId(userId) {
  const user = new User()
  
  console.log(user.findByUserId,"@")
  let id =(await findByUserId(userId)).dataValues.id;
  console.log(userId,id,"nick")
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include:{ ...INCLUDE_USER.include,
      where: { userId }
    },
  });
}
// GET /tweets/:id
export async function getTweet() {}

export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

// POST /tweeets
export async function create(text, userId) {
  return Tweet.create({ text, userId }).then((data) => {
    console.log(data, "data");
    return data;
  }).then(data=>this.getById(data.dataValues.id));
}

// PUT /tweets/:id

export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then((tweet) => {
      tweet.text = text;
      return tweet.save();
    });
}
// DELETE /tweets/:id

export async function remove(id) {
  return Tweet.findByPk(id) //
    .then((tweet) => {
      tweet.destroy();
    });
}

