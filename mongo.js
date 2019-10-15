const mongoose = require("mongoose");
//require("dotenv").config();

//const connStr = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const [, , password, name, number] = process.argv;

const url = `mongodb+srv://fullstack:${password}@study-bs6um.azure.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length <= 3) {
  console.log("phonebook:");

  (async () => {
    try {
      const result = await Person.find({});
      result.forEach(person => {
        console.log(person.name, person.number);
      });
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.connection.close();
    }
  })();
} else {
  (async () => {
    const person = new Person({ name, number });
    try {
      const result = await person.save();
      console.log(`added ${result.name} number ${result.number} to phonebook`);
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.connection.close();
    }
  })();
}
