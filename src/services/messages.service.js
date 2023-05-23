import { messagesManager } from "../dao/index.js";
import MessagesRepository from "../repository/messages.repository.js";

const messagesRepository = new MessagesRepository(messagesManager);

export const getMessages = async () => await messagesRepository.getMessages();

export const getMessage = async (mid) =>
  await messagesRepository.getMessage(mid);

export const addMessage = async (user, message) =>
  await messagesRepository.addMessage(user, message);

export const updateMessage = async (mid, message) =>
  await messagesRepository.updateMessage(mid, message);

export const deleteMessage = async (mid) =>
  await messagesRepository.deleteMessage(mid);
