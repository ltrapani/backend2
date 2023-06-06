import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import config from "./config/config.js";
import UsersDto from "./dao/DTOs/users.dto.js";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = dirname(__filename);

export const generateToken = (user) =>
  jwt.sign({ user }, config.private_key, { expiresIn: "24h" });

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = new UsersDto(user);
      next();
    })(req, res, next);
  };
};

export const authorization = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role)
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });
    next();
  };
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.gmail_user,
    pass: config.gmail_pass,
  },
});
