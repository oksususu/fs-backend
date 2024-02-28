require("dotenv").config();

const { Client } = require("pg");
const client = new Client({
  host: process.env.DB_HOST,
  port: 5432,
  database: "shoppingmall",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

client.connect();

module.exports = client;
