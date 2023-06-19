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

const cartRepository = new CartsRepository(cartsManager);
const userRepository = new UsersRepository(usersManager);

export const getUserByEmail = async (email) =>
  userRepository.findByEmail(email);

export const getUserById = async (id) => userRepository.findById(id);

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
  user.role = role;
  await userRepository.update(user.email, user);
};
