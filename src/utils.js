import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import config from "./config/config.js";
import UsersDto from "./dao/DTOs/users.dto.js";
import multer from "multer";
import logger from "./logger/logger.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = dirname(__filename);

export const generateToken = (user) =>
  jwt.sign({ user }, config.private_key, { expiresIn: "24h" });

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);

      if (!user) {
        return res.status(401).render("login", {
          status: "error",
          messages: info.messages ? info.messages : info.toString(),
        });
      }

      req.user = new UsersDto(user);

      if (req.user.role === "admin") req.user.isAdmin = true;
      if (req.user.role === "premium") req.user.isPremium = true;
      if (req.user.role === "user") req.user.isUser = true;

      next();
    })(req, res, next);
  };
};

export const authorization = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role))
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

export const storageDocuments = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uid } = req.params;
    const { storage, pid } = req.query;

    let path;

    if (storage === "documents") {
      path = `${__dirname}/public/documents/${uid}/`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      return cb(null, path);
    }

    if (storage === "profile") {
      path = `${__dirname}/public/profiles`;
      return cb(null, path);
    }

    if (storage === "products" && pid) {
      path = `${__dirname}/public/products/${pid}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      return cb(null, path);
    }

    if (storage === "products" && !pid) {
      return cb({ status: "error", message: "Error, you do not send pid" });
    }
    return cb({ status: "error", message: "Error, no query params" });
  },
  filename: (req, file, cb) => {
    const { storage, pid } = req.query;

    const extension = file.mimetype.split("/")[1];
    let fileName = `${req.user._id}-${file.fieldname}.${extension}`;

    if (storage === "products" && pid) {
      fileName = `${pid}-${Date.now()}.${extension}`;
    }

    cb(null, fileName);
  },
});

export const uploader = (storage) =>
  multer({
    storage,
    onError: (err, next) => {
      if (err) {
        logger.error(err.message);
        next(err);
      }
      next();
    },
  });
