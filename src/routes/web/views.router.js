import { Router } from "express";
import passport from "passport";
import {
  getAll as getAllService,
  getProduct as getProductService,
  getProductsPaginate as getProductsPaginateService,
} from "../../services/products.service.js";
import { isInvalidId } from "../../lib/validators/validator.js";
import { getCart } from "../../services/carts.service.js";
import { authorization, passportCall } from "../../utils.js";
import logger from "../../logger/logger.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    res.redirect("/products");
  }
);

router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const products = await getAllService();
      res.render("realTimeProducts", { products, user: req.user });
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  }
);

router.get(
  "/chat",
  passportCall("jwt"),
  authorization("user"),
  async (req, res) => {
    res.render("chat", { user: req.user });
  }
);

router.get(
  "/products/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let { limit = 10, page = 1, query = "", sort = "" } = req.query;

      const response = await getProductsPaginateService(
        limit,
        page,
        query,
        sort
      );

      res.render("products", { response, user: req.user });
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  }
);

router.get(
  "/products/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { pid } = req.params;
      if (isInvalidId(pid))
        return res.status(400).send({ status: "error", message: "Invalid id" });

      const product = await getProductService(pid);
      if (!product)
        return res
          .status(404)
          .send({ error: "error", message: "Product not found" });

      res.render("productDetail", { ...product._doc, user: req.user });
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  }
);

router.get(
  "/carts/:cid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { cid } = req.params;
      if (isInvalidId(cid))
        return res.status(400).send({ status: "error", message: "Invalid id" });

      const cart = await getCart(cid);
      if (!cart)
        return res
          .status(404)
          .send({ status: "error", message: "Cart id not found" });

      res.render("cart", { ...cart, user: req.user });
    } catch (error) {
      logger.error(error);
      res.status(500).send(error);
    }
  }
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.render("profile", {
      user: req.user,
    });
  }
);

export default router;
