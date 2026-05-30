const express = require("express");
const { v4: uuidv4 } = require("uuid");
const sessionRouter = express.Router();

sessionRouter.post("/", (req, res) => {
  const sessionId = uuidv4();
  res.json({ sessionId, createdAt: Date.now() });
});

sessionRouter.get("/:id", (req, res) => {
  res.json({ sessionId: req.params.id, active: true });
});

module.exports = { sessionRouter };
