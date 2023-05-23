import { usersManager } from "../dao/index.js";
import { cartsManager } from "../dao/index.js";
import UsersRepository from "../repository/users.repository.js";
import CartsRepository from "../repository/carts.repository.js";
import { isAdmin } from "../lib/validators/validator.js";
import { createHash, generateToken } from "../utils.js";

const cartRepository = new CartsRepository(cartsManager);
const userRepository = new UsersRepository(usersManager);

const getUserByEmail = async (email) => userRepository.findByEmail(email);

const register = async (first_name, last_name, email, age, role, password) => {
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

const login = async (user, password) => {
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

const githubCallback = async (user) => {
  user = await userRepository.login(user);
  if (!user.cart) {
    const cart = await cartRepository.createCart();
    user.cart = cart._id.toString();
    await userRepository.update(user.email, user);
  }

  return generateToken(user);
};

export { getUserByEmail, register, login, githubCallback };
