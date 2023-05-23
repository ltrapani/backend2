import { io } from "../app.js";
import * as messagesService from "../services/messages.service.js";

export const chat = async (socket) => {
  console.log(`Nuevo cliente conectado. ID: ${socket.id}`);

  socket.on("message", async ({ user, message }) => {
    await messagesService.addMessage(user, message);
    const messages = await messagesService.getMessages();

    io.emit("messageLogs", messages);
  });

  socket.on("authenticated", async (user) => {
    const messages = await messagesService.getMessages();
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", user);
  });
};
