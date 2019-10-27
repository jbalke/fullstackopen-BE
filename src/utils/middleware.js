//eslint-disable-next-line
const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).json({ message: "malformed id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  } else {
    return res.status(500).end();
  }
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "endpoint unknown" });
};

module.exports = {
  errorHandler,
  unknownEndpoint
};
