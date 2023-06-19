import { Router } from "express";
import passport from "passport";
import { authorization, passportCall } from "../../utils.js";
import * as usersController from "../../controllers/users.controller.js";

const router = Router();

router.post("/register", usersController.register);

router.post("/login", usersController.login);

router.get("/logout", usersController.logout);

router.post(
  "/send-email-reset-password",
  usersController.sendEmailResetPassword
);

router.post("/reset-password", usersController.resetPassword);

router.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] }),
  usersController.github
);

router.get(
  "/github-callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  usersController.githubCallback
);

router.get("/current", passportCall("jwt"), usersController.current);

router.post(
  "/premium/:uid",
  passportCall("jwt"),
  authorization("admin"),
  usersController.updateRole
);

export default router;
