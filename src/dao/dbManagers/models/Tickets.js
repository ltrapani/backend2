import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchame = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    purchaser: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: {
      createdAt: "purchase_datetime",
    },
  }
);

export const ticketModel = mongoose.model(ticketsCollection, ticketsSchame);
