import { productsManager } from "../dao/index.js";
import { io } from "../app.js";

const getProductsPaginate = async (limit, page, query, sort) => {
  if (query) query = JSON.parse(query);
  if (sort) sort = { price: sort };

  const response = await productsManager.getProductsPaginate(
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

const getAll = async () => await productsManager.getAll();

const getProduct = async (pid) => await productsManager.getProduct(pid);

const getProductByCode = async (code) =>
  await productsManager.getProductByCode(code);

const addProduct = async (product) => {
  const response = await productsManager.addProduct(product);

  const products = await productsManager.getAll();
  io.emit("realTimeProducts", products);
  return response;
};

const updateProduct = async (pid, product) =>
  await productsManager.updateProduct(pid, product);

const deleteProduct = async (pid) => {
  const response = await productsManager.deleteProduct(pid);

  const products = await productsManager.getAll();
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
