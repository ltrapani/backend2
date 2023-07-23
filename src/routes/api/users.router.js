import { Router } from "express";
import passport from "passport";
import {
  authorization,
  passportCall,
  storageDocuments,
  uploader,
} from "../../utils.js";
import * as usersController from "../../controllers/users.controller.js";

const router = Router();

router.post("/register", usersController.register);

router.post("/login", usersController.login);

router.get("/logout", passportCall("jwt"), usersController.logout);

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

router.get(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  usersController.getUsers
);

router.delete(
  "/:uid",
  passportCall("jwt"),
  authorization("admin"),
  usersController.deleteUser
);

router.delete(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  usersController.deleteInactiveUsers
);

router.post(
  "/:uid/documents",
  passportCall("jwt"),
  uploader(storageDocuments).fields([
    { name: "identification", maxCount: 1 },
    { name: "address", maxCount: 1 },
    { name: "statusCount", maxCount: 1 },
    { name: "profile", maxCount: 1 },
    { name: "products", maxCount: 4 },
    { name: "pid", maxCount: 1 },
  ]),
  usersController.documents
);

export default router;
