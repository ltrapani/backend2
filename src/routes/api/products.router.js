import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductsPaginate,
  updateProduct,
} from "../../controllers/products.controller.js";

const router = Router();

router.get("/", getProductsPaginate);

router.get("/:pid", getProduct);

router.post("/", addProduct);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

export default router;
