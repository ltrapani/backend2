import { nanoid } from "nanoid";
import { cartsManager } from "../dao/index.js";
import CartsRepository from "../repository/carts.repository.js";
import * as productsService from "./products.service.js";
import * as ticketsService from "./tickets.service.js";
import { transporter } from "../utils.js";

const cartRepository = new CartsRepository(cartsManager);

const createCart = async () => await cartRepository.createCart();

const getCart = async (cid) => await cartRepository.getCart(cid);

const addProduct = async (cart, product) => {
  const index = cart.products.findIndex(
    (p) => p.product._id.toString() === product._id.toString()
  );
  if (index === -1) cart.products.push({ product: product._id });
  if (index !== -1) cart.products[index].quantity += 1;

  return await cartRepository.addProduct(cart._id, cart);
};

const updateCart = async (cid, cart) =>
  await cartRepository.updateCart(cid, cart);

const updateQuantity = async (cart, product, quantity) => {
  const index = cart.products.findIndex(
    (p) => p.product._id.toString() === product._id.toString()
  );
  if (index === -1) cart.products.push({ product: product._id, quantity });

  if (index !== -1) cart.products[index].quantity = quantity;

  return await cartRepository.updateCart(cart._id, cart);
};

const deleteProduct = async (cart, product) =>
  await cartRepository.deleteProduct(cart._id, product._id);

const deleteAllProducts = async (cart) =>
  await cartRepository.deleteAllProducts(cart._id);

const purchase = async (cart, email) => {
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
      await productsService.updateProduct(pid, productDB);

      cart.products = cart.products.filter(
        (p) => p.product._id.toString() !== pid
      );

      await updateCart(cart._id, cart);
    }
  }

  if (ticket.amount) {
    cart.ticket = await ticketsService.createTicket(ticket);
    await transporter.sendMail({
      from: "Ecommerce<ecommercecoderhouse@gmail.com>",
      to: email,
      subject: "Compra Web",
      html: `
      <div>
        <h1>Muchas gracias por tu compra.</h1>
        <p>El codigo de tu compra es: ${cart.ticket.code}</p>
        <strong>Saludos coordiales.</strong>
      </div>`,
    });
  }

  return cart;
};

export {
  createCart,
  getCart,
  addProduct,
  updateCart,
  updateQuantity,
  deleteProduct,
  deleteAllProducts,
  purchase,
};
