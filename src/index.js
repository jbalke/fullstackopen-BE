const express = require("express");
const app = express();
const apiRouter = require("./api");
const morgan = require("morgan");
const data = require("./data.json");

app.use(express.json());

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

app.use("/api", apiRouter(data));

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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
