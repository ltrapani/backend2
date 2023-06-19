import { incompleteValues, isInvalidId } from "../lib/validators/validator.js";
import logger from "../logger/logger.js";
import * as cartsService from "../services/carts.service.js";
import * as productsService from "../services/products.service.js";

import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
  invalidIdErrorInfo,
  notFoundErrorInfo,
} from "../services/errors/info.js";

export const createCart = async (req, res) => {
  try {
    const response = await cartsService.createCart();

    res.send({ status: "success", message: "Cart created", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await cartsService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "Cart id not found" });

    res.send({ status: "success", cart });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    if (isInvalidId(cid, pid)) {
      const err = CustomError.createError({
        message: invalidIdErrorInfo(),
        code: EErrors.INVALID_TYPES_ERROR,
      });
      throw err;
    }

    const cart = await cartsService.getCart(cid);
    if (!cart) {
      const err = CustomError.createError({
        message: notFoundErrorInfo("cart"),
        code: EErrors.NOT_FOUND,
      });
      throw err;
    }

    const product = await productsService.getProduct(pid);
    if (!product) {
      const err = CustomError.createError({
        message: notFoundErrorInfo("product"),
        code: EErrors.NOT_FOUND,
      });
      throw err;
    }

    const response = await cartsService.addProduct(cart, product, req.user);
    if (!response)
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });

    res.send({ status: "success", message: "Product added.", response });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { newCart } = req.body;

    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await cartsService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const response = await cartsService.updateCart(cid, newCart);

    res.send({ status: "success", message: "Cart updated", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (incompleteValues(quantity))
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values" });

    if (isInvalidId(cid, pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await cartsService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const product = await productsService.getProduct(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "product not found" });

    const response = await cartsService.updateQuantity(cart, product, quantity);

    res.send({ status: "success", message: "Cart updated", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (isInvalidId(cid, pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await cartsService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const product = await productsService.getProduct(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "product not found" });

    const response = await cartsService.deleteProduct(cart, product);

    res.send({ status: "success", message: "Product was deleted.", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await cartsService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    if (req.user.cart !== cid)
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });

    const response = await cartsService.deleteAllProducts(cart);

    res.send({
      status: "success",
      message: `All products was deleted from cart`,
      response,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error });
  }
};

export const purchase = async (req, res) => {
  try {
    const { cid } = req.params;
    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await cartsService.getCart(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    if (req.user.cart !== cid)
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });

    const result = await cartsService.purchase(cart, req.user.email);
    if (result.products.length === 0)
      return res.send({
        status: "success",
        message: `Purchase success. We send you an email`,
        result,
      });

    if (result?.ticket) {
      return res.send({
        status: "success",
        message: `Purchase success. We send you an email. There is not enough stock of some products. Which were left in the cart. `,
        result,
      });
    }

    res.send({
      status: "error",
      message: `There is not enough stock of products. Which were left in the cart`,
      result,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};
