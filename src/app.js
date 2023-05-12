import express from "express";
import "./dao/dbManagers/dbConfig.js";

import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/web/views.router.js";
import productsRouter from "./routes/api/products.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import usersRouter from "./routes/api/users.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";

import Messages from "./dao/dbManagers/messages.js";
const messagesManager = new Messages();

const app = express();

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

const server = app.listen(8080, () => console.log("Listening on port 8080"));
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado. ID: ${socket.id}`);

  socket.on("message", async ({ user, message }) => {
    await messagesManager.addMessage(user, message);
    const messages = await messagesManager.getAll();

    io.emit("messageLogs", messages);
  });

  socket.on("authenticated", async (user) => {
    const messages = await messagesManager.getAll();
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", user);
  });
});

export { io };
