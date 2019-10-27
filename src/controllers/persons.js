const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.param("id", async (req, res, next, id) => {
  try {
    let person = await Person.findById(id);
    if (person) {
      req.person = person;
      next();
    } else {
      return res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

personsRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const people = await Person.find({});
      res.json(people.map(person => person.toJSON()));
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    let { name = "", number = "" } = req.body;

    name = name.trim();
    number = number.trim();

    if (!name || !number) {
      return res.status(400).json({ message: "Name and number are required" });
    }

    const person = new Person({ name, number });
    try {
      const savedPerson = await person.save();
      console.log(
        `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
      );
      return res.status(201).json(savedPerson.toJSON());
    } catch (error) {
      next(error);
    }
  });

personsRouter
  .route("/:id")
  .get((req, res) => {
    if (req.person) {
      return res.json(req.person.toJSON());
    } else {
      return res.status(404).end();
    }
  })
  .put(async (req, res, next) => {
    const { number } = req.body;
    if (req.person) {
      try {
        let updatedPerson = await Person.findByIdAndUpdate(
          req.person.id,
          { number },
          { new: true }
        );

        return res.status(200).json(updatedPerson.toJSON());
      } catch (error) {
        next(error);
      }
    }
  })
  .delete(async (req, res, next) => {
    try {
      await Person.findByIdAndDelete(req.person.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = personsRouter;
