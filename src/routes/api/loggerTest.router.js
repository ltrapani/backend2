import { Router } from "express";
import logger from "../../logger/logger.js";

const router = Router();

router.get("/", (req, res) => {
  logger.fatal("fatal message");
  logger.error("error message");
  logger.warning("warning message");
  logger.info("info message");
  logger.http("http message");
  logger.debug("debug message");

  res.send({ status: "success", message: "Logger Test" });
});

export default router;
