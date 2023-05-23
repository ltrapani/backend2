import { Router } from "express";

import {
  addProduct,
  createCart,
  deleteAllProducts,
  deleteProduct,
  getCart,
  purchase,
  updateCart,
  updateQuantity,
} from "../../controllers/carts.controller.js";
import { authorization, passportCall } from "../../utils.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCart);
router.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization("user"),
  addProduct
);
router.put("/:cid", updateCart);
router.put("/:cid/product/:pid", updateQuantity);
router.delete("/:cid/products/:pid", deleteProduct);
router.delete("/:cid/", deleteAllProducts);

router.post("/:cid/purchase", passportCall("jwt"), purchase);

export default router;
