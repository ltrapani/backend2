import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductsPaginate,
  updateProduct,
  getMockingProducts,
} from "../../controllers/products.controller.js";
import { authorization, passportCall } from "../../utils.js";

const router = Router();

router.get("/", getProductsPaginate);

router.get("/mocking-products", getMockingProducts);

router.get("/:pid", getProduct);

router.post("/", passportCall("jwt"), authorization("admin"), addProduct);

router.put("/:pid", passportCall("jwt"), authorization("admin"), updateProduct);

router.delete(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  deleteProduct
);

export default router;
