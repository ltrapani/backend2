import { nanoid } from "nanoid";
import { cartsManager } from "../dao/index.js";
import CartsRepository from "../repository/carts.repository.js";
import * as productsService from "./products.service.js";
import * as ticketsService from "./tickets.service.js";
import { purchaseHtml } from "../utils/htmlTemplates.js";
import { sendEmail } from "./email.service.js";

const cartRepository = new CartsRepository(cartsManager);

export const createCart = async () => await cartRepository.createCart();

export const getCart = async (cid) => {
  const cart = await cartRepository.getCart(cid);
  if (!cart) return null;
  let total = 0;
  if (cart.products.length > 0) {
    cart.products.forEach((product) => {
      total += product.product.price * product.quantity;
    });
    cart.total = total;
  }
  return cart;
};

export const addProduct = async (cart, product, user) => {
  if (product.owner === user.email) return false;
  const index = cart.products.findIndex(
    (p) => p.product._id.toString() === product._id.toString()
  );
  if (index === -1) cart.products.push({ product: product._id });
  if (index !== -1) cart.products[index].quantity += 1;

  return await cartRepository.addProduct(cart._id, cart);
};

export const updateCart = async (cid, cart) =>
  await cartRepository.updateCart(cid, cart);

export const updateQuantity = async (cart, product, quantity) => {
  const index = cart.products.findIndex(
    (p) => p.product._id.toString() === product._id.toString()
  );
  if (index === -1) cart.products.push({ product: product._id, quantity });

  if (index !== -1) cart.products[index].quantity = quantity;

  return await cartRepository.updateCart(cart._id, cart);
};

export const deleteProduct = async (cart, product) =>
  await cartRepository.deleteProduct(cart._id, product._id);

export const deleteAllProducts = async (cart) =>
  await cartRepository.deleteAllProducts(cart._id);

export const purchase = async (cart, user) => {
  const ticket = {
    code: nanoid(20),
    amount: 0,
    purchaser: user.email,
  };

  const cartRest = { ...cart };
  const cartSuccess = { ...cart, products: [] };

  for (let productCart of cart.products) {
    const pid = productCart.product._id.toString();
    const quantity = productCart.quantity;
    const productDB = await productsService.getProduct(pid);
    if (productDB.stock >= quantity) {
      ticket.amount += productDB.price * quantity;
      productDB.stock = productDB.stock - quantity;
      await productsService.updateProductCheckout(pid, productDB);

      cartRest.products = cartRest.products.filter(
        (p) => p.product._id.toString() !== pid
      );

      cartSuccess.products.push(productCart);
    }
  }

  if (cartSuccess.products.length) {
    cartSuccess.ticket = await ticketsService.createTicket(ticket);

    const html = purchaseHtml(user, cartSuccess);
    await sendEmail(user.email, "Web purchase", html);

    await updateCart(cart._id, cartRest);
  }

  return cartSuccess;
};
