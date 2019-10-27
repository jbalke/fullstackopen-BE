const express = require("express");
const app = express();
const config = require("./utils/config");
const cors = require("cors");
const personsRouter = require("./controllers/persons");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");
const middleware = require("./utils/middleware");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const url = `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}@${config.MONGODB_DB}?retryWrites=true&w=majority`;

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

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", req => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    let output = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms"
    ];

    if (req.method === "POST") {
      output = [...output, tokens.body(req, res)];
    }

    return output.join(" ");
  })
);

app.get("/info", async (req, res) => {
  let count = await Person.estimatedDocumentCount();
  res.status(200).send(`
  <div>
  Phonebook has info for ${count} people</br></br>
  ${new Date()}
  </div>
  `);
});

app.use("/api/persons", personsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
