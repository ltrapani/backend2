export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProductsPaginate = async (limit, page, query, sort) =>
    this.dao.getProductsPaginate(limit, page, query, sort);

  getAll = async () => await this.dao.getAll();

  getProduct = async (pid) => await this.dao.getProduct(pid);

  getProductByCode = async (code) => await this.dao.getProductByCode(code);

  addProduct = async (product) => await this.dao.addProduct(product);

  updateProduct = async (pid, product) =>
    await this.dao.updateProduct(pid, product);

  deleteProduct = async (pid) => await this.dao.deleteProduct(pid);
}
