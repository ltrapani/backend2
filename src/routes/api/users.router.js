import { Router } from "express";
import passport from "passport";
import { passportCall } from "../../utils.js";
import {
  current,
  github,
  githubCallback,
  login,
  logout,
  register,
} from "../../controllers/users.controller.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] }),
  github
);

router.get(
  "/github-callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  githubCallback
);

router.get("/current", passportCall("jwt"), current);

export default router;
