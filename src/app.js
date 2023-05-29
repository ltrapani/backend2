import express from "express";
import errorHandler from "./middleware/errors/index.js";
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
import { chat } from "./chat/chat.js";

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

app.use(errorHandler);

const server = app.listen(8080, () => console.log("Listening on port 8080"));
export const io = new Server(server);

io.on("connection", (socket) => chat(socket));
