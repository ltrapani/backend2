import mongoose from "mongoose";
import config from "../../config/config.js";
import logger from "../../logger/logger.js";

const URI = config.mongoUrl;

try {
  await mongoose.connect(URI);
  logger.info("Connected to Atlas mongoDB");
} catch (error) {
  logger.error(error.message);
}
