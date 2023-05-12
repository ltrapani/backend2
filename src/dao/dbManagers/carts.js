import { cartModel } from "./models/carts.js";

export default class Carts {
  constructor() {
    console.log("Working carts with DB in mongoDB");
  }

  createCart = async () => await cartModel.create({});

  getCart = async (cid) => {
    const result = await cartModel
      .findOne({ _id: cid })
      .populate("products.product");
    return result?.toObject();
  };

  addProduct = async (cid, cart) =>
    await cartModel.updateOne({ _id: cid }, cart);

  update = async (cid, cart) => await cartModel.updateOne({ _id: cid }, cart);

  deleteProduct = async (cid, pid) =>
    await cartModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );

  deleteAllProducts = async (cid) =>
    await cartModel.updateOne({ _id: cid }, { products: [] });
}
