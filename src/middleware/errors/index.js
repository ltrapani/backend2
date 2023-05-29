import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
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
        message: "unhandled error",
      });
      break;
  }
  next();
};
