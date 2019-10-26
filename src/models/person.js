const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
    index: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: v => v.replace(/[^0-9]/g, "").length >= 8,
      message: `must have at least 8 digits!`
    }
  }
});

personSchema.plugin(uniqueValidator);

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
