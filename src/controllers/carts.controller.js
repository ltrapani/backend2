import { incompleteValues, isInvalidId } from "../lib/validators/validator.js";
import {
  createCart as createCartService,
  getCart as getCartService,
  addProduct as addProductService,
  updateCart as updateCartService,
  updateQuantity as updateQuantityService,
  deleteProduct as deleteProductService,
  deleteAllProducts as deleteAllProductsService,
} from "../services/carts.service.js";

import { getProduct as getProductService } from "../services/products.service.js";

const createCart = async (req, res) => {
  try {
    const response = await createCartService();

    res.send({ status: "success", message: "Cart created", response });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(500).send({ error });
  }
};

const addProduct = async (req, res) => {
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

    const response = await addProductService(cart, product);

    res.send({ status: "success", message: "Product added.", response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
};
