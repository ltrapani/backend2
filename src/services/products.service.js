import { productsManager } from "../dao/index.js";
import { io } from "../app.js";
import ProductsRepository from "../repository/products.repository.js";
import { generateProduct } from "../mocking/products.mock.js";
import fs from "fs";
import logger from "../logger/logger.js";
import { sendEmail } from "./email.service.js";
import { productDelete } from "../utils/htmlTemplates.js";

const productRepository = new ProductsRepository(productsManager);

export const getProductsPaginate = async (limit, page, query, sort) => {
  if (query) query = JSON.parse(query);
  if (sort) sort = { price: sort };

  const response = await productRepository.getProductsPaginate(
    limit,
    page,
    query,
    sort
  );

  if (query) query = JSON.stringify(query);

  response.status = "success";
  response.prevLink = response.hasPrevPage
    ? `/products?limit=${limit}&page=${response.prevPage}${
        query ? `&query=${query}` : ""
      }${sort ? `&sort=${sort.price}` : ""}`
    : null;
  response.nextLink = response.hasNextPage
    ? `/products?limit=${limit}&page=${response.nextPage}${
        query ? `&query=${query}` : ""
      }${sort ? `&sort=${sort.price}` : ""}`
    : null;

  response.payload = response.docs;
  delete response.docs;

  return response;
};

export const getAll = async () => await productRepository.getAll();

export const getProduct = async (pid) =>
  await productRepository.getProduct(pid);

export const getProductByCode = async (code) =>
  await productRepository.getProductByCode(code);

export const addProduct = async (product, user) => {
  if (user.role === "premium") {
    product.owner = user.email;
  }

  const response = await productRepository.addProduct(product);

  const products = await productRepository.getAll();
  io.emit("realTimeProducts", products);
  return response;
};

export const updateProduct = async (product, newProduct, user) => {
  let response = false;
  if (user.role === "admin") {
    response = await productRepository.updateProduct(product._id, newProduct);
  }

  if (product.owner === user.email) {
    response = await productRepository.updateProduct(product._id, newProduct);
  }
  if (response) {
    const products = await productRepository.getAll();
    io.emit("realTimeProducts", products);
  }
  return response;
};

export const updateProductCheckout = async (pid, newProduct) =>
  await productRepository.updateProduct(pid, newProduct);

export const deleteProduct = async (product, user) => {
  let response = false;
  if (user.role === "admin") {
    response = await productRepository.deleteProduct(product._id);
  }

  if (product.owner === user.email) {
    response = await productRepository.deleteProduct(product._id);
  }
  if (response) {
    const products = await productRepository.getAll();
    io.emit("realTimeProducts", products);
  }

  if (response && product.owner !== "admin")
    await sendEmail(product.owner, "PRODUCT DELETE", productDelete(product));

  return response;
};

export const getMockingProducts = async (quantity) => {
  const mockingProducts = [];
  for (let i = 0; i < quantity; i++) {
    mockingProducts.push(generateProduct());
  }
  return mockingProducts;
};

export const updateThumbnail = async (product, files) => {
  files.forEach((file) => {
    product.thumbnail.push(`/products/${product._id}/${file.filename}`);
  });
  return await productRepository.updateProduct(product._id, product);
};

export const deleteInvalidThumbnail = async (files) => {
  const { destination } = files[0];
  fs.rm(destination, { recursive: true }, (err) => {
    if (err) {
      logger.error(err.message);
      throw err;
    }

    logger.info(`${destination} is deleted!`);
  });
};
