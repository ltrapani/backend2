import { incompleteValues, isInvalidId } from "../lib/validators/validator.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import {
  addDuplicateProductErrorInfo,
  addProductErrorInfo,
} from "../services/errors/info.js";

import {
  deleteProduct as deleteProductService,
  updateProduct as updateProductService,
  addProduct as addProductService,
  getProduct as getProductService,
  getProductsPaginate as getProductsPaginateService,
  getProductByCode as getProductByCodeService,
  getMockingProducts as getMockingProductsService,
} from "../services/products.service.js";

const getProductsPaginate = async (req, res) => {
  try {
    let { limit = 10, page = 1, query = "", sort = "" } = req.query;

    const response = await getProductsPaginateService(limit, page, query, sort);

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (isInvalidId(pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const product = await getProductService(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });

    res.send({ status: "success", product });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const addProduct = async (req, res, next) => {
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

    const product = await getProductByCodeService(code);
    if (product) {
      const err = CustomError.createError({
        message: addDuplicateProductErrorInfo(code),
        code: EErrors.INVALID_TYPES_ERROR,
      });
      throw err;
    }

    const response = await addProductService(newProduct);

    res.send({ status: "success", message: "Product added", response });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const newProduct = req.body;
    if (isInvalidId(pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const product = await getProductService(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });

    const response = await updateProductService(pid, newProduct);

    res.send({ status: "success", message: "Product update", response });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (isInvalidId(pid))
      return res.status(400).send({ status: "error", message: "Invalid id" });

    const product = await getProductService(pid);
    if (!product)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });

    const response = await deleteProductService(pid);

    res.send({ status: "success", message: "Product delete", response });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getMockingProducts = async (req, res) => {
  const response = await getMockingProductsService(100);
  res.send({ status: "success", message: "Mocking products", response });
};

export {
  getProductsPaginate,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getMockingProducts,
};
