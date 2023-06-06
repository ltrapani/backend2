import { incompleteValues, isInvalidId } from "../lib/validators/validator.js";
import logger from "../logger/logger.js";
import {
  createCart as createCartService,
  getCart as getCartService,
  addProduct as addProductService,
  updateCart as updateCartService,
  updateQuantity as updateQuantityService,
  deleteProduct as deleteProductService,
  deleteAllProducts as deleteAllProductsService,
  purchase as purchaseService,
} from "../services/carts.service.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
  invalidIdErrorInfo,
  notFoundErrorInfo,
} from "../services/errors/info.js";

import { getProduct as getProductService } from "../services/products.service.js";

const createCart = async (req, res) => {
  try {
    const response = await createCartService();

    res.send({ status: "success", message: "Cart created", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await getCartService(cid);
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

const addProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    if (isInvalidId(cid, pid)) {
      const err = CustomError.createError({
        message: invalidIdErrorInfo(),
        code: EErrors.INVALID_TYPES_ERROR,
      });
      throw err;
    }

    const cart = await getCartService(cid);
    if (!cart) {
      const err = CustomError.createError({
        message: notFoundErrorInfo("cart"),
        code: EErrors.NOT_FOUND,
      });
      throw err;
    }

    const product = await getProductService(pid);
    if (!product) {
      const err = CustomError.createError({
        message: notFoundErrorInfo("product"),
        code: EErrors.NOT_FOUND,
      });
      throw err;
    }

    const response = await addProductService(cart, product);

    res.send({ status: "success", message: "Product added.", response });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { newCart } = req.body;

    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await getCartService(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const response = await updateCartService(cid, newCart);

    res.send({ status: "success", message: "Cart updated", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (incompleteValues(quantity))
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values" });

    if (isInvalidId(cid, pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await getCartService(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const product = await getProductService(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "product not found" });

    const response = await updateQuantityService(cart, product, quantity);

    res.send({ status: "success", message: "Cart updated", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (isInvalidId(cid, pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await getCartService(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const product = await getProductService(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "product not found" });

    const response = await deleteProductService(cart, product);

    res.send({ status: "success", message: "Product was deleted.", response });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await getCartService(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const response = await deleteAllProductsService(cart);

    res.send({
      status: "success",
      message: `All products was deleted from cart`,
      response,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ error });
  }
};

const purchase = async (req, res) => {
  try {
    const { cid } = req.params;
    if (isInvalidId(cid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const cart = await getCartService(cid);
    if (!cart)
      return res
        .status(404)
        .send({ status: "error", message: "cart not found" });

    const result = await purchaseService(cart, req.user.email);
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

export {
  createCart,
  getCart,
  addProduct,
  updateCart,
  updateQuantity,
  deleteProduct,
  deleteAllProducts,
  purchase,
};
