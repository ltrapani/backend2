import logger from "../../logger/logger.js";
import { userModel } from "./models/users.js";

export default class Users {
  constructor() {
    logger.info("Working users with DB in mongoDB");
  }

  create = async (user) => await userModel.create(user);

  findById = async (uid) => await userModel.findOne({ _id: uid });

  findByEmail = async (email) => await userModel.findOne({ email });

  update = async (email, user) => await userModel.updateOne({ email }, user);

  delete = async (uid) => await userModel.deleteOne({ _id: uid });
}
