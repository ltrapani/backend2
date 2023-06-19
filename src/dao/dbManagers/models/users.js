import mongoose from "mongoose";

const userCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: String,
  role: {
    type: String,
    default: "user",
  },
  resetPasswordDate: {
    type: Date,
    default: 0,
  },
});

export const userModel = mongoose.model(userCollection, usersSchema);
