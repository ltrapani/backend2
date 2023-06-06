import logger from "../../logger/logger.js";
import { productModel } from "./models/products.js";

export default class Products {
  constructor() {
    logger.info("Working products with DB in mongoDB");
  }

  getProductsPaginate = async (limit, page, query, sort) =>
    await productModel.paginate(query, {
      limit,
      page,
      sort,
      lean: true,
    });

  getAll = async () => {
    const products = await productModel.find();
    return products.map((product) => product.toObject());
  };

  addProduct = async (product) => await productModel.create(product);

  getProduct = async (pid) => await productModel.findOne({ _id: pid });

  getProductByCode = async (code) => await productModel.findOne({ code });

  updateProduct = async (pid, product) =>
    await productModel.updateOne({ _id: pid }, product);

  deleteProduct = async (pid) => await productModel.deleteOne({ _id: pid });
}
