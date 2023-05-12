import dotenv from "dotenv";

dotenv.config();

export default {
  mongoUrl: process.env.MONGO_URL,
  private_key: process.env.PRIVATE_KEY,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
};
