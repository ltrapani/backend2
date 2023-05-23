import { productsManager } from "../dao/index.js";
import { io } from "../app.js";
import ProductsRepository from "../repository/products.repository.js";

const productRepository = new ProductsRepository(productsManager);

const getProductsPaginate = async (limit, page, query, sort) => {
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
    ? `http://localhost:8080/products?limit=${limit}&page=${response.prevPage}${
        query ? `&query=${query}` : ""
      }${sort ? `&sort=${sort.price}` : ""}`
    : null;
  response.nextLink = response.hasNextPage
    ? `http://localhost:8080/products?limit=${limit}&page=${response.nextPage}${
        query ? `&query=${query}` : ""
      }${sort ? `&sort=${sort.price}` : ""}`
    : null;

  response.payload = response.docs;
  delete response.docs;

  return response;
};

const getAll = async () => await productRepository.getAll();

const getProduct = async (pid) => await productRepository.getProduct(pid);

const getProductByCode = async (code) =>
  await productRepository.getProductByCode(code);

const addProduct = async (product) => {
  const response = await productRepository.addProduct(product);

  const products = await productRepository.getAll();
  io.emit("realTimeProducts", products);
  return response;
};

const updateProduct = async (pid, product) =>
  await productRepository.updateProduct(pid, product);

const deleteProduct = async (pid) => {
  const response = await productRepository.deleteProduct(pid);

  const products = await productRepository.getAll();
  io.emit("realTimeProducts", products);
  return response;
};

export {
  getProductsPaginate,
  getAll,
  getProduct,
  getProductByCode,
  addProduct,
  updateProduct,
  deleteProduct,
};
