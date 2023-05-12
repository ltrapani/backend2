import { cartsManager, productsManager } from "../dao/index.js";

const createCart = async () => await cartsManager.createCart();

const getCart = async (cid) => await cartsManager.getCart(cid);

const addProduct = async (cart, product) => {
  const index = cart.products.findIndex(
    (p) => p.product._id.toString() === product._id.toString()
  );
  if (index === -1) cart.products.push({ product: product._id });
  if (index !== -1) cart.products[index].quantity += 1;

  return await cartsManager.addProduct(cart._id, cart);
};

const updateCart = async (cid, cart) => await cartsManager.update(cid, cart);

const updateQuantity = async (cart, product, quantity) => {
  const index = cart.products.findIndex(
    (p) => p.product._id.toString() === product._id.toString()
  );
  if (index === -1) cart.products.push({ product: product._id, quantity });

  if (index !== -1) cart.products[index].quantity = quantity;

  return await cartsManager.update(cart._id, cart);
};

const deleteProduct = async (cart, product) =>
  await cartsManager.deleteProduct(cart._id, product._id);

const deleteAllProducts = async (cart) =>
  await cartsManager.deleteAllProducts(cart._id);

export {
  createCart,
  getCart,
  addProduct,
  updateCart,
  updateQuantity,
  deleteProduct,
  deleteAllProducts,
};
