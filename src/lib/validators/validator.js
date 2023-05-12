import config from "../../config/config.js";

const isInvalidId = (...ids) => ids.some((id) => id.length !== 24);

const incompleteValues = (...values) => values.some((value) => !value);

const isAdmin = (email, password) =>
  email === config.admin_email && password === config.admin_password;

export { isInvalidId, incompleteValues, isAdmin };
