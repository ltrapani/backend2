import { incompleteValues, isInvalidId } from "../lib/validators/validator.js";
import logger from "../logger/logger.js";
import * as userService from "../services/users.service.js";
import { generateToken, validatePassword } from "../utils.js";

export const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      age,
      role = "user",
      password,
    } = req.body;

    if (incompleteValues(first_name, last_name, email, age, password))
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values" });

    const user = await userService.getUserByEmail(email);
    if (user)
      return res
        .status(400)
        .send({ status: "error", message: "User already exists!" });

    await userService.register(
      first_name,
      last_name,
      email,
      age,
      role,
      password
    );

    res.send({ status: "success", message: "user registered" });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (incompleteValues(email, password))
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values" });

    const user = await userService.getUserByEmail(email);
    if (!user)
      return res
        .status(400)
        .send({ status: "error", message: "Invalid credentials" });

    if (!validatePassword(user, password))
      return res
        .status(400)
        .send({ status: "error", message: "Invalid credentials" });

    const response = await userService.login(user, password);

    const accessToken = generateToken(response);

    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      })
      .send({ status: "success", message: "login success" });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("coderCookieToken");
  res.redirect("/login");
};

export const sendEmailResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (incompleteValues(email))
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values" });

    const user = await userService.getUserByEmail(email);
    if (!user)
      return res
        .status(400)
        .send({ status: "error", message: "Invalid Email" });

    await userService.sendEmailResetPassword(user);

    res.send({ status: "success", message: "We send you an email" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const github = async (req, res) => {
  res.send({ status: "sucess", message: "user registered" });
};

export const githubCallback = async (req, res) => {
  try {
    const accessToken = await userService.githubCallback(req.user);

    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      })
      .redirect("/products");
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
};

export const current = async (req, res) => {
  res.send({ user: req.user });
};

export const resetPassword = async (req, res) => {
  try {
    const { password, id } = req.body;
    if (incompleteValues(password, id))
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values" });

    const result = await userService.resetPassword(id, password);
    if (!result)
      return res
        .status(400)
        .send({ status: "error", message: "Can not enter current password" });

    res.send({ status: "success", message: "Password update successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const updateRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;

    if (isInvalidId(uid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    if (!["user", "premium"].includes(role))
      return res.status(400).send({ status: "error", message: "Invalid role" });

    const user = await userService.getUserById(uid);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });

    await userService.updateRole(user, role);

    res.send({ status: "success", message: "User update successfully" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};
