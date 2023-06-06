import logger from "../../logger/logger.js";
import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
  logger.error(error.message);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({
        status: error.status,
        message: error.message,
      });
      break;

    case EErrors.NOT_FOUND:
      res.status(404).send({
        status: error.status,
        message: error.message,
      });
      break;

    default:
      res.send({
        status: "error",
        message: `Unhandled error: ${error.message}`,
      });
      break;
  }
  next();
};
