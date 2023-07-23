import { incompleteValues, isInvalidId } from "../lib/validators/validator.js";
import logger from "../logger/logger.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
  addDuplicateProductErrorInfo,
  addProductErrorInfo,
} from "../services/errors/info.js";

import * as productsService from "../services/products.service.js";

export const getProductsPaginate = async (req, res) => {
  try {
    let { limit = 10, page = 1, query = "", sort = "" } = req.query;

    const response = await productsService.getProductsPaginate(
      limit,
      page,
      query,
      sort
    );

    res.send(response);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (isInvalidId(pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const product = await productsService.getProduct(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });

    res.send({ status: "success", product });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const newProduct = req.body;
    const { title, description, code, price, stock, category } = newProduct;
    if (incompleteValues(title, description, code, price, stock, category)) {
      const err = CustomError.createError({
        message: addProductErrorInfo({
          title,
          description,
          code,
          price,
          stock,
          category,
        }),
        code: EErrors.INVALID_TYPES_ERROR,
      });
      throw err;
    }

    const product = await productsService.getProductByCode(code);
    if (product) {
      const err = CustomError.createError({
        message: addDuplicateProductErrorInfo(code),
        code: EErrors.INVALID_TYPES_ERROR,
      });
      throw err;
    }

    const response = await productsService.addProduct(newProduct, req.user);

    res.send({
      status: "success",
      message: "Product added",
      response,
      user: req.user,
    });
  } catch (error) {
    logger.error(error.message);
    next(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const newProduct = req.body;
    if (isInvalidId(pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const product = await productsService.getProduct(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });

    const response = await productsService.updateProduct(
      product,
      newProduct,
      req.user
    );

    if (!response)
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });

    res.send({ status: "success", message: "Product update", response });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (isInvalidId(pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const product = await productsService.getProduct(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });

    const response = await productsService.deleteProduct(product, req.user);
    if (!response)
      return res
        .status(403)
        .send({ status: "error", message: "You don't have permissions" });

    res.send({ status: "success", message: "Product delete", response });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send(error);
  }
};

export const getMockingProducts = async (req, res) => {
  const response = await productsService.getMockingProducts(100);
  res.send({ status: "success", message: "Mocking products", response });
};
