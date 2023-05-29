export default class CustomError {
  static createError({ status = "error", message, code = 1 }) {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    return error;
  }
}
