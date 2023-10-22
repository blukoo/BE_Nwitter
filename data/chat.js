import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { Friend, findFriendShip } from "./friend.js";
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
    type: DataTypes.JSON,
  },
  friend2Msg: {
    type: DataTypes.JSON,
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
    friend1Msg: [],
    friend2Msg: [],
  }).then((data) => {
    return data;
  });
}
/**
 *
 * @friendShipId : 친구 관계 pk
 * @friendId : 친구 id
 * @myId : 내 id
 * @chatId : chat pk
 * @description : chatId가 있으면 chat을 그냥 가져오고 아니면 create 는 초기 세팅으로 친구 관계 정보가 필요
 */
export async function getChat({ friendShipId, friendId, myId, chatId }) {
  let whereSentence;
  let friendData;
  if (friendShipId) {
    friendData = await findFriendShip(friendShipId);
    whereSentence = {
      [Op.and]: [
        { friend1Id: { [Op.or]: [friendId, myId] } },
        { friend2Id: { [Op.or]: [friendId, myId] } },
      ],
    };
  } else {
    whereSentence = {
      id: chatId,
    };
  }
  console.log(friendShipId, chatId, whereSentence, "chatId");
  return Chat.findOne({
    ...ORDER_DESC,
    where: whereSentence,
  }).then((data) => {
    console.log(data, "datassssss");
    if (data && friendData) {
      data.dataValues.friend1Info = friendData.requestFriend;
      data.dataValues.friend2Info = friendData.replyFriend;
      data.friend1Msg = JSON.parse(data.friend1Msg);
      data.friend2Msg = JSON.parse(data.friend2Msg);
    }
    return data ?? {};
  });
}

export async function updateChat(chatId, myId, msg) {
  console.log(chatId, myId, msg,"chatId, myId, msg")
  return Chat.findByPk(chatId).then((chatV) => {
    let arr = chatV.friend1Id == myId ? chatV.friend1Msg : chatV.friend2Msg;
    arr = JSON.parse(arr.replace(/^"(.*)"$/, '$1').replace(/\\/g, ''))
    arr.push(msg)
    let updateV = arr
    if (chatV.friend1Id == myId) {
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
