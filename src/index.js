const express = require("express");
const cors = require("cors");
require("dotenv").config();
const apiRouter = require("./api");
const morgan = require("morgan");
// const data = require("./data.json");
const services = require("./services/db");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
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

app.use("/api", apiRouter(services));

app.get("/info", (req, res) => {
  res.status(200).send(`
  <div>
  Phonebook has info for ${data.length} people</br></br>
  ${new Date()}
  </div>
  `);
});

app.use((req, res) => {
  res.status(404).json({ error: "endpoint unknown" });
});

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
