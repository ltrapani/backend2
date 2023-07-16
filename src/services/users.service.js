import moment from "moment";
import { usersManager } from "../dao/index.js";
import { cartsManager } from "../dao/index.js";
import UsersRepository from "../repository/users.repository.js";
import CartsRepository from "../repository/carts.repository.js";
import { isAdmin } from "../lib/validators/validator.js";
import { createHash, generateToken, validatePassword } from "../utils.js";
import { sendEmail } from "./email.service.js";
import config from "../config/config.js";
import { resetPasswordHtml } from "../utils/htmlTemplates.js";
import * as productsService from "../services/products.service.js";

const cartRepository = new CartsRepository(cartsManager);
const userRepository = new UsersRepository(usersManager);

export const getUserByEmail = async (email) =>
  await userRepository.findByEmail(email);

export const getUserById = async (id) => await userRepository.findById(id);

export const register = async (
  first_name,
  last_name,
  email,
  age,
  role,
  password
) => {
  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    role,
  };
  return await userRepository.create(newUser);
};

export const login = async (user, password) => {
  user.last_connection = moment().format();
  await userRepository.update(user.email, user);
  user = await userRepository.login(user);

  if (!user.cart) {
    const cart = await cartRepository.createCart();
    user.cart = cart._id.toString();
    await userRepository.update(user.email, user);
  }

  if (isAdmin(user.email, password)) {
    user.role = "admin";
  }

  return user;
};

export const logout = async (user) => {
  user = await userRepository.findById(user._id);
  user.last_connection = moment().format();
  return await userRepository.update(user.email, user);
};

export const githubCallback = async (user) => {
  user = await userRepository.login(user);
  if (!user.cart) {
    const cart = await cartRepository.createCart();
    user.cart = cart._id.toString();
    await userRepository.update(user.email, user);
  }

  return generateToken(user);
};

export const sendEmailResetPassword = async (user) => {
  const expirationDate = moment().format();
  user.resetPasswordDate = expirationDate;
  await userRepository.update(user.email, user);

  const html = resetPasswordHtml(user._id);

  await sendEmail(user.email, "Ecommerce - Reset Password", html);
};

export const validateUrlExpiration = async (id) => {
  const user = await userRepository.findById(id);
  const now = new moment();
  const expirationDate = moment(user.resetPasswordDate).utc().format();
  const diff = now.diff(expirationDate, "minutes");
  return diff < config.reset_password_minutes;
};

export const resetPassword = async (id, password) => {
  const user = await userRepository.findById(id);
  const samePassword = validatePassword(user, password);
  if (samePassword) return false;
  user.password = createHash(password);
  user.resetPasswordDate = 0;
  return await userRepository.update(user.email, user);
};

export const updateRole = async (user, role) => {
  if (
    user.documents.length !== Number(config.number_of_documents) &&
    role === "premium"
  )
    return null;

  user.role = role;
  return await userRepository.update(user.email, user);
};

export const getUsers = async () => {
  const users = await userRepository.getUsers();
  return users.filter((u) => u.email !== config.admin_email);
};

export const deleteUser = async (uid) => await userRepository.delete(uid);

export const saveDocuments = async (user, files) => {
  const docs = ["identification", "address", "statusCount"];

  const newFiles = [];
  docs.forEach((doc) => {
    if (files[doc]) newFiles.push(files[doc][0]);
  });

  newFiles.forEach((file) => {
    if (!user.documents.some((doc) => doc.name === file.fieldname))
      user.documents.push({
        name: file.fieldname,
        reference: `/documents/${user._id}/${file.filename}`,
      });
  });

  return await userRepository.update(user.email, user);
};

export const saveUserProfile = async (user, file) => {
  if (!user.profile) user.profile = `/profiles/${file.filename}`;

  return await userRepository.update(user.email, user);
};

export const saveProductsPhotos = async (pid, files) => {
  const product = await productsService.getProduct(pid);
  if (!product) {
    await productsService.deleteInvalidThumbnail(files);
    return res
      .status(404)
      .send({ status: "error", message: "Product not found" });
  }

  return await productsService.updateThumbnail(product, files);
};
