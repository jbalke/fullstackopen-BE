const mongoose = require("mongoose");
const Person = require("../models/person");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

console.log("connecting to", url);

(async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("mongodb connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

module.exports = { Person };
