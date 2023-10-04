import { db } from "../db/database.js";
import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { User, findByUserId } from "./users.js";
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;
const Op = Sequelize.Op;
const Friend = sequelize.define("friend", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  requestFriendId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  replyFriendId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isFriend: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});
Friend.belongsTo(User,{as:"requestFriend"});
Friend.belongsTo(User,{as:"replyFriend"});
const INCLUDE_USER = {
  attributes: [
    "requestFriendId",
    "replyFriendId",
    "isFriend",
    "createdAt",
  ],
  include: [
    {
      model: User,
      attributes: ["id", "nickname"],
      as: "requestFriend",
    },
    {
      model: User,
      attributes: ["id", "nickname"],
      as: "replyFriend",
    },
  ],
};

const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};
Friend.belongsTo(User);
export async function getById(id) {
  return Friend.findOne({
    where: { id },
  });
}
export async function getFriend(id) {
  console.log(id,"ddddd")
  console.log(id,Friend,"ddddd")
  return Friend.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: {
      isFriend: true,
      [Op.or]: [{ requestFriendId: id }, { replyFriendId: id }],
    },
  });
}
export async function getRequestFriend(id) {
  console.log(id,Friend,"ddddd")
  return Friend.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: 
      // [Op.or]: [{ requestFriendId: id }, { replyFriendId: id }],
      { requestFriendId: id },
    
  });
}
export async function getReplyFriend(id) {
  console.log(id,Friend,"ddddd")
  return Friend.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: 
      // [Op.or]: [{ requestFriendId: id }, { replyFriendId: id }],
      { replyFriendId: id },
    
  });
}
export async function insertFriend(requestFriendId, replyFriendId, isFriend) {
  console.log(requestFriendId, replyFriendId, isFriend,{requestFriendId, replyFriendId, isFriend},"requestFriend, replyFriend, isFrien11")
  return Friend.create({requestFriendId, replyFriendId, isFriend}).then(data=>{
    return data
  }).then(data=>this.getById(data.dataValues.id))
}
// PUT /tweets/:id

export async function updateFriend(id, isFriend) {
  return Friend.findByPk(id) //
    .then((friend) => {
      friend.isFriend = isFriend;
      return friend.save();
    });
}
// DELETE /tweets/:id

export async function deleteFriend(id) {
  return Friend.findByPk(id) //
    .then((friend) => {
      friend.destroy();
    });
}
