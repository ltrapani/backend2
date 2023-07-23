import * as usersService from "../services/users.service.js";
import * as productsService from "../services/products.service.js";
import * as cartsService from "../services/carts.service.js";
import logger from "../logger/logger.js";
import { isInvalidId } from "../lib/validators/validator.js";

export const home = async (req, res) => {
  try {
    res.redirect("/products");
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const realTimeProducts = async (req, res) => {
  try {
    const products = await productsService.getAll();
    res.render("realTimeProducts", { products, user: req.user });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const chat = async (req, res) => {
  try {
    res.render("chat", { user: req.user });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const productsPaginate = async (req, res) => {
  try {
    let { limit = 10, page = 1, query = "", sort = "" } = req.query;

    const response = await productsService.getProductsPaginate(
      limit,
      page,
      query,
      sort
    );

    res.render("productsPaginate", { response, user: req.user });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const productsDetail = async (req, res) => {
  try {
    const { pid } = req.params;
    if (isInvalidId(pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const product = await productsService.getProduct(pid);
    if (!product)
      return res
        .status(404)
        .send({ error: "error", message: "Product not found" });

    res.render("productDetail", { ...product._doc, user: req.user });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const cart = async (req, res) => {
  try {
    const { cid } = req.params;
    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await cartsService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "Cart id not found" });

    if (cart._id.toString() !== req.user.cart)
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });

    res.render("cart", { ...cart, user: req.user });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const register = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const profile = async (req, res) => {
  try {
    const user = await usersService.getUserByEmail(req.user.email);
    req.user.profile = user.profile;

    res.render("profile", {
      user: req.user,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const documents = async (req, res) => {
  try {
    const user = await usersService.getUserByEmail(req.user.email);
    req.user.documents = user.documents;
    const docs = ["identification", "address", "statusCount"];
    const documents = docs.map((item) => {
      if (user.documents.some((doc) => doc.name === item)) {
        return {
          name: item,
          status: "File Uploaded - You can update it",
          style: "text-success",
        };
      } else {
        return { name: item, status: "Pending", style: "text-warning" };
      }
    });

    res.render("documents", {
      user: req.user,
      documents,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const sendEmailResetPassword = async (req, res) => {
  try {
    res.render("sendEmailResetPassword");
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return res.render("sendEmailResetPassword");

    const isValidUrl = await usersService.validateUrlExpiration(id);
    if (!isValidUrl) return res.render("sendEmailResetPassword");

    res.render("resetPassword");
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const users = async (req, res) => {
  try {
    res.render("users", {
      user: req.user,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const mockingProducts = async (req, res) => {
  try {
    const response = await productsService.getMockingProducts(100);

    res.render("mockingProducts", {
      user: req.user,
      response,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};
