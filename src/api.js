const express = require("express");

function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (!id) return res.status(400).json({ error: "Provided id is not valid." });

  req.personId = id;
  next();
}

function apiRouter(data) {
  const router = express.Router();

  // middleware to reject invalid person ids that are NaN
  router.use("/persons/:id", validateId);

  router.get("/persons", (req, res) => {
    res.json(data);
  });

  router.get("/persons/:id", (req, res) => {
    const { personId } = req;

    const person = data.find(p => p.id === personId);

    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "Person does not exist" });
    }
  });

  router.post("/persons", (req, res) => {
    const max = 1000000,
      min = 100;
    const nextId = Math.floor(Math.random() * (max - min) + min);

    let { name = "", number = "" } = req.body;

    name = name.trim();
    number = number.trim();

    if (!name || !number) {
      return res.status(400).json({ error: "Name and number are required" });
    }

    const existingPerson = data.find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if (existingPerson) {
      return res.status(403).json({ error: "Name must be unique." });
    }

    //data = [...data, { name, number, nextId }];
    data.push({ name, number, id: nextId });
    res.status(201).json(data[data.length - 1]);
  });

  router.delete("/persons/:id", (req, res) => {
    const { personId } = req;
    const person = data.find(p => p.id === personId);

    if (person) {
      data = data.filter(p => p.id !== person.id);
      res.status(200).json({ messge: "Person deleted" });
    } else {
      res.status(404).json({ error: "Person does not exist" });
    }
  });

  return router;
}

module.exports = apiRouter;
