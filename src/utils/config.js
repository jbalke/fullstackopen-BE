require("dotenv").config();

let { PORT, MONGODB_DB, MONGODB_USER, MONGODB_PASSWORD } = process.env;

module.exports = { PORT, MONGODB_DB, MONGODB_USER, MONGODB_PASSWORD };
