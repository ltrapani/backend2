import { Router } from "express";
import * as productsController from "../../controllers/products.controller.js";
import { authorization } from "../../utils.js";

const router = Router();

router.get("/", productsController.getProductsPaginate);

router.get("/mocking-products", productsController.getMockingProducts);

router.get("/:pid", productsController.getProduct);

router.post(
  "/",
  authorization("admin", "premium"),
  productsController.addProduct
);

router.put(
  "/:pid",
  authorization("admin", "premium"),
  productsController.updateProduct
);

router.delete(
  "/:pid",
  authorization("admin", "premium"),
  productsController.deleteProduct
);

export default router;
