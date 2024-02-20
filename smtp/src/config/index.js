const path = require("path");
const { config } = require("dotenv");

config({
  debug: process.env.NODE_ENV === "development" ? true : false,
  // path: path.join(__dirname, "..", "..", ".env"),
});

const PORT = process.env.PORT || 33000;
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  PORT,
  NODE_ENV,
  RABBITMQ_URL,
  EMAIL_SENDER,
  RESEND_API_KEY,
};
