import { __dirname } from "../utils.js";
import { path } from "path";
import fs from "fs";
import logger from "../logger/logger.js";

export const generateId = (array) => {
  return array.length === 0 ? 1 : array[array.length - 1]._id + 1;
};

export const validateId = (id, array) => {
  return array.some((p) => p._id === Number(id));
};

export const getAbsolutePath = async (relativePath) => {
  try {
    const absolutePath = path.join(__dirname, relativePath);
    if (!fs.existsSync(absolutePath))
      await fs.promises.writeFile(absolutePath, JSON.stringify([]));
    return absolutePath;
  } catch (error) {
    logger.error(error);
  }
};

export const writeInfo = async (data, path) => {
  try {
    return await fs.promises.writeFile(path, JSON.stringify(data, null, "\t"));
  } catch (error) {
    logger.error(error);
  }
};

export const readInfo = async (path) => {
  try {
    return await fs.promises.readFile(path, "utf-8");
  } catch (error) {
    logger.error(error);
  }
};
