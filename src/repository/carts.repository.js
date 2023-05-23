export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createCart = async () => await this.dao.createCart();

  getCart = async (cid) => await this.dao.getCart(cid);

  addProduct = async (cid, cart) => await this.dao.addProduct(cid, cart);

  updateCart = async (cid, cart) => await this.dao.updateCart(cid, cart);

  deleteProduct = async (cid, pid) => await this.dao.deleteProduct(cid, pid);

  deleteAllProducts = async (cid) => await this.dao.deleteAllProducts(cid);
}
