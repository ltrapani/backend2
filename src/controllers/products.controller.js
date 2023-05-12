import { incompleteValues, isInvalidId } from "../lib/validators/validator.js";
import {
  deleteProduct as deleteProductService,
  updateProduct as updateProductService,
  addProduct as addProductService,
  getProduct as getProductService,
  getProductsPaginate as getProductsPaginateService,
  getProductByCode as getProductByCodeService,
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

const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    const { title, description, code, price, stock, category } = newProduct;
    if (incompleteValues(title, description, code, price, stock, category))
      return res
        .status(400)
        .send({ status: "error", message: "Incomplete values" });

    const product = await getProductByCodeService(code);
    if (product)
      return res
        .status(404)
        .send({ status: "error", message: "Code already exists" });

    const response = await addProductService(newProduct);

    res.send({ status: "success", message: "Product added", response });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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

export {
  getProductsPaginate,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
