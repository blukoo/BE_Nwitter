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
  messageList: {
    type: DataTypes.JSON,
  },
});
const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};

export async function createChat(friendId, myId) {
  return Chat.create({
    friend1Id: myId,
    friend2Id: friendId,
    messageList: [],
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
  }
  return Chat.findOne({
    ...ORDER_DESC,
    where: friendShipId
      ? {
          [Op.and]: [
            { friend1Id: { [Op.or]: [friendId, myId] } },
            { friend2Id: { [Op.or]: [friendId, myId] } },
          ],
        }
      : {
          id: chatId,
        },
  }).then((data) => {
    console.log(data, "datassssss");
    if (data) {
      if (friendData) {
        data.dataValues.friend1Info = friendData.requestFriend;
        data.dataValues.friend2Info = friendData.replyFriend;
      }
      let obj = JSON.parse(
        data.messageList.replace(/^"(.*)"$/, "$1").replace(/\\/g, "")
      );
      console.log(data.messageList, obj, "data.messageList");
      data.messageList = obj;
      return data;
    }
    return {};
  });
}

export async function updateChat(chatId, myInfo, msg) {
  console.log(chatId, myInfo, msg, "chatId, myId, msg");
  return Chat.findByPk(chatId).then((chatV) => {
    let arr = chatV.messageList;
    let messageData = { id: myInfo.id, nickname: myInfo.nickname, message: msg };
    arr = JSON.parse(arr.replace(/^"(.*)"$/, "$1").replace(/\\/g, ""));
    arr.push(messageData);
    chatV.messageList = JSON.stringify(arr);
    return chatV.save();
  });
}
export async function deleteChat(chatId, myId, msg) {
  return Chat.findByPk(chatId).then((chat) => {
    chat.destroy();
  });
}
