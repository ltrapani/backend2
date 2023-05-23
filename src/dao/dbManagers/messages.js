import { messageModel } from "./models/messages.js";

export default class Messages {
  constructor() {
    console.log("Working messages with DB in mongoDB");
  }

  getMessages = async () => {
    const messages = await messageModel.find();
    return messages.map((message) => message.toObject());
  };

  getMessage = async (id) => await messageModel.findOne({ _id: id });

  addMessage = async (user, message) =>
    await messageModel.create({ user, message });

  updateMessage = async (mid, message) =>
    messageModel.updateOne({ _id: mid }, message);

  deleteMessage = async (mid) => messageModel.deleteOne({ _id: mid });
}
