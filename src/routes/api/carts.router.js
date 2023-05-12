import { Router } from "express";

import {
  addProduct,
  createCart,
  deleteAllProducts,
  deleteProduct,
  getCart,
  updateCart,
  updateQuantity,
} from "../../controllers/carts.controller.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCart);
router.post("/:cid/product/:pid", addProduct);
router.put("/:cid", updateCart);
router.put("/:cid/product/:pid", updateQuantity);
router.delete("/:cid/products/:pid", deleteProduct);
router.delete("/:cid/", deleteAllProducts);

export default router;
