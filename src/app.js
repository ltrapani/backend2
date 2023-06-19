import express from "express";
import errorHandler from "./middleware/errors/index.js";
import "./dao/dbManagers/dbConfig.js";

import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { __dirname, passportCall } from "./utils.js";
import viewsRouter from "./routes/web/views.router.js";
import productsRouter from "./routes/api/products.router.js";
import cartsRouter from "./routes/api/carts.router.js";
import usersRouter from "./routes/api/users.router.js";
import loggerTest from "./routes/api/loggerTest.router.js";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import { chat } from "./chat/chat.js";
import logger from "./logger/logger.js";
import config from "./config/config.js";

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

app.use("/api/products", passportCall("jwt"), productsRouter);
app.use("/api/carts", passportCall("jwt"), cartsRouter);
app.use("/api/users", usersRouter);
app.use("/logger-test", loggerTest);
app.use("/", viewsRouter);

app.use(errorHandler);

const PORT = config.port || 8080;
const server = app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
export const io = new Server(server);

io.on("connection", (socket) => chat(socket));
