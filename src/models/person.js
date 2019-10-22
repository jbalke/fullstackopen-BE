const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

console.log("created Person");

personSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  }
});

console.log("creating Person model...");

module.exports = mongoose.model("Person", personSchema);
