import { Router } from "express";
import * as cartsController from "../../controllers/carts.controller.js";
import { authorization } from "../../utils.js";

const router = Router();

router.post("/", cartsController.createCart);
router.get("/:cid", cartsController.getCart);
router.post(
  "/:cid/product/:pid",
  authorization("user", "premium"),
  cartsController.addProduct
);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/product/:pid", cartsController.updateQuantity);
router.delete("/:cid/products/:pid", cartsController.deleteProduct);
router.delete("/:cid/", cartsController.deleteAllProducts);

router.post("/:cid/purchase", cartsController.purchase);

export default router;
