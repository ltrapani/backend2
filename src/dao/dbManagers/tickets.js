import { ticketModel } from "./models/Tickets.js";

export default class Tickets {
  constructor() {
    console.log("Working tickets with DB in mongoDB");
  }

  create = async (ticket) => await ticketModel.create(ticket);

  findById = async (tid) => await ticketModel.findOne({ _id: tid });

  findByCode = async (code) => await ticketModel.findOne({ code });

  update = async (code, ticket) =>
    await ticketModel.updateOne({ code }, ticket);

  delete = async (tid) => await ticketModel.deleteOne({ _id: tid });
}
