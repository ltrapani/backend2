import dotenv from "dotenv";

dotenv.config();

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  private_key: process.env.PRIVATE_KEY,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  callback_url: process.env.CALLBACK_URL,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  gmail_user: process.env.GMAIL_USER,
  gmail_pass: process.env.GMAIL_PASS,
  reset_password_minutes: process.env.RESET_PASSWORD_MINUTES,
  number_of_documents: process.env.NUMBER_OF_DOCUMENTS,
  minutes_inactives_users: process.env.MINUTES_INACTIVES_USERS,
  host_url: process.env.HOST_URL,
};
