import Carts from "./dbManagers/carts.js";
import Products from "./dbManagers/products.js";
import Messages from "./dbManagers/messages.js";
import Users from "./dbManagers/users.js";
import Tickets from "./dbManagers/tickets.js";

export const cartsManager = new Carts();
export const productsManager = new Products();
export const messagesManager = new Messages();
export const usersManager = new Users();
export const ticketsManager = new Tickets();
