import { Router } from "express";
import passport from "passport";
import { authorization, passportCall } from "../../utils.js";
import * as viewController from "../../controllers/view.controller.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false, failureRedirect: "/login" }),
  viewController.home
);

router.get(
  "/realtimeproducts",
  passportCall("jwt"),
  authorization("admin", "premium"),
  viewController.realTimeProducts
);

router.get(
  "/chat",
  passportCall("jwt"),
  authorization("user", "premium"),
  viewController.chat
);

router.get("/products/", passportCall("jwt"), viewController.productsPaginate);

router.get(
  "/products/:pid",
  passportCall("jwt"),
  viewController.productsDetail
);

router.get(
  "/carts/:cid",
  passportCall("jwt"),
  authorization("user", "premium"),
  viewController.cart
);

router.get(
  "/update-role",
  passportCall("jwt"),
  authorization("admin"),
  viewController.updateRole
);

router.get(
  "/mocking-products",
  passportCall("jwt"),
  viewController.mockingProducts
);

router.get("/profile", passportCall("jwt"), viewController.profile);

// publics router

router.get("/register", viewController.register);
router.get("/login", viewController.login);
router.get("/send-email-reset-password", viewController.sendEmailResetPassword);
router.get("/reset-password", viewController.resetPassword);

export default router;
