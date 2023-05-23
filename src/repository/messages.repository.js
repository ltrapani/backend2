import MessagesDto from "../dao/DTOs/messages.dto.js";

export default class MessagesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getMessages = async () => await this.dao.getMessages();

  getMessage = async (mid) => {
    const message = await this.dao.getMessage(mid);
    return new MessagesDto(message);
  };

  addMessage = async (user, message) =>
    await this.dao.addMessage(user, message);

  updateMessage = async (mid, message) =>
    await this.dao.updateMessage(mid, message);

  deleteMessage = async (mid) => await this.dao.deleteMessage(mid);
}
