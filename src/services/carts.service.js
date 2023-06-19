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

export const purchase = async (cart, email) => {
  const ticket = {
    code: nanoid(20),
    amount: 0,
    purchaser: email,
  };

  for (let productCart of cart.products) {
    const pid = productCart.product._id.toString();
    const quantity = productCart.quantity;
    const productDB = await productsService.getProduct(pid);
    if (productDB.stock >= quantity) {
      ticket.amount += productDB.price * quantity;
      productDB.stock = productDB.stock - quantity;
      await productsService.updateProductCheckout(pid, productDB);

      cart.products = cart.products.filter(
        (p) => p.product._id.toString() !== pid
      );

      await updateCart(cart._id, cart);
    }
  }

  if (ticket.amount) {
    cart.ticket = await ticketsService.createTicket(ticket);

    const html = purchaseHtml(cart.ticket.code);
    await sendEmail(email, "Web purchase", html);
  }

  return cart;
};
