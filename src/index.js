const express = require("express");
const app = express();
const apiRouter = require("./api");
const data = require("./data.json");

app.use(express.json());

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
