import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { Friend } from "./friend.js";
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;
const Op = Sequelize.Op;
const Chat = sequelize.define("chat", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  friend1Id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  friend2Id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  friend1Msg: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue("friend1Msg"));
    },
    set: function (val) {
      return this.setDataValue("friend1Msg", JSON.stringify(val));
    },
  },
  friend2Msg: {
    type: DataTypes.STRING,
    get: function () {
      return JSON.parse(this.getDataValue("friend2Msg"));
    },
    set: function (val) {
      return this.setDataValue("friend2Msg", JSON.stringify(val));
    },
  },
});
Chat.belongsTo(Friend, { as: "friend1Info" });
Chat.belongsTo(Friend, { as: "friend2Info" });

const INCLUDE_USER = {
  attributes: ["id", "requestFriend", "replyFriend"],
  include: [
    {
      model: Friend,
      // attributes: ["id", "nickname"],
      as: "friend1Info",
    },
    {
      model: Friend,
      // attributes: ["id", "nickname"],
      as: "friend2Info",
    },
  ],
};
const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};

export async function createChat(friendId, myId) {
  console.log(friendId, myId);
  return Chat.create({
    friend1Id:myId,
    friend2Id:friendId,
    friend1Msg: "[]",
    friend2Msg: "[]",
  }).then((data) => {
    return data;
  });
}
export async function getChat(friendId, myId) {
  console.log(friendId, myId);
  return Chat.findOne({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: {
      // isFriend: true,
      [Op.and]: [
        { friend1Id: { [Op.or]: [id, myId] } },
        { friend2Id: { [Op.or]: [id, myId] } },
      ],
    },
  }).then((data) => {
    return data;
  });
}

export async function updateChat(chatId, myId, msg) {
  console.log(myId, msg);
  return Chat.findByPk(chatId).then((chatV) => {
    let updateV =
      chatV.friend1Id === myId ? chatV.friend1Msg : chatV.friend2Msg;
    updateV = JSON.parse(updateV).push(msg);
    if (chatV.friend1Id === myId) {
      chatV.friend1Msg = JSON.stringify(updateV);
    } else {
      chatV.friend2Msg = JSON.stringify(updateV);
    }
    return chatV.save();
  });
}
export async function deleteChat(chatId, myId, msg) {
  return Chat.findByPk(chatId).then((chat) => {
    chat.destroy();
  });
}
