import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { User, findByUserId } from "./users.js";
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;
const Op = Sequelize.Op;
export const Friend = sequelize.define("friend", {
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
Friend.belongsTo(User, { as: "requestFriend" });
Friend.belongsTo(User, { as: "replyFriend" });
const INCLUDE_USER = {
  attributes: [
    "id",
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
  return Friend.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: {
      isFriend: true,
      [Op.or]: [{ requestFriendId: id }, { replyFriendId: id }],
    },
  });
}
export async function findFriendShip(friendShipId) {
  return await Friend.findOne({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: {
      id: friendShipId,
    },
  });
}

export async function getConnectFriend(id, myId) {
  return await Friend.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: {
      // isFriend: true,
      [Op.and]: [
        { requestFriendId: { [Op.or]: [id, myId] } },
        { replyFriendId: { [Op.or]: [id, myId] } },
      ],
    },
  });
}
export async function getRequestFriend(id) {
  return Friend.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where:
      // [Op.or]: [{ requestFriendId: id }, { replyFriendId: id }],
      {
        isFriend: false,
        requestFriendId: id,
      },
  });
}
export async function getReplyFriend(id) {
  return Friend.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where:
      // [Op.or]: [{ requestFriendId: id }, { replyFriendId: id }],
      {
        isFriend: false,
        replyFriendId: id,
      },
  });
}
export async function createFriend(requestFriendId, replyFriendId) {

  return Friend.create({ requestFriendId, replyFriendId, isFriend: false })
    .then((data) => {
      return data;
    })
    .then((data) => this.getById(data.dataValues.id));
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
export async function getNotConnectFriend(nickname, myId) {
  let users = await User.findAll({
    where: {
      id: { [Op.not]: myId },
      nickname: { [Op.like]: "%" + nickname + "%" },
    },
  });
  let arr = [];
  for (let i = 0; i < users.length; i++) {
    let value = await getConnectFriend(users[i].id, myId);
    if (!value.length) {
      arr.push(users[i].dataValues);
    }
  }
  return arr;
}
