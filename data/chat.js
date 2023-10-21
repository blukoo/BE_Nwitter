import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { Friend,findFriendShip } from "./friend.js";
import { User, findByUserId } from "./users.js";
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
let friendShipIdData = null;
// Chat.belongsTo(Friend, {
//   attributes: ["id", "requestFriend", "replyFriend"],
//   as: "friend1Info",
//   where: { id: friendShipIdData },
//   // foreignkey: 'friend1'
// });
// Chat.belongsTo(Friend, {
//   // attributes: ["id"],
//   as: "friend2Info",
//   // foreignkey: 'friend22'
// });

const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};

export async function createChat(friendId, myId) {
  return Chat.create({
    friend1Id: myId,
    friend2Id: friendId,
    friend1Msg: "[]",
    friend2Msg: "[]",
  }).then((data) => {
    return data;
  });
}
//  Friend.belongsTo(User, { as: "friend1Info" });
//  Friend.belongsTo(User, { as: "friend2Info" });
//  const INCLUDE_USER = {
//   //  attributes: [
//     //  "id",
//      // "isFriend",
//      // "createdAt",
//   //  ],
//    include: [
//      {
//        model: User,
//        attributes: ["id", "nickname"],
//        as: "friend1Info",
//      },
//      {
//        model: User,
//        attributes: ["id", "nickname"],
//        as: "friend2Info",
//      },
//    ],
//  };

// Friend.belongsTo(User, { as: "requestFriend" });
// Friend.belongsTo(User, { as: "replyFriend" });
// const INCLUDE_USER = {
//   attributes: [
//     "id",
//     "requestFriendId",
//     "replyFriendId",
//     "isFriend",
//     "createdAt",
//   ],
//   include: [
//     {
//       model: User,
//       attributes: ["id", "nickname"],
//       as: "requestFriend",
//     },
//     {
//       model: User,
//       attributes: ["id", "nickname"],
//       as: "replyFriend",
//     },
//   ],
// };

// Friend.belongsTo(User);
export async function getChat(friendShipId, friendId, myId) {
  friendShipIdData = friendShipId;


  let friendData = await findFriendShip(friendShipId);
  return Chat.findOne({
    ...ORDER_DESC,
    where: {
      // isFriend: true,
      [Op.and]: [
        { friend1Id: { [Op.or]: [friendId, myId] } },
        { friend2Id: { [Op.or]: [friendId, myId] } },
      ],
    },
  }).then((data) => {
    if(data.id){
      data.dataValues.friend1Info = friendData.requestFriend
      data.dataValues.friend2Info = friendData.replyFriend
    } 
    console.log(data, "ddddd??");
    return data ?? {};
  });
}

export async function updateChat(chatId, myId, msg) {
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
