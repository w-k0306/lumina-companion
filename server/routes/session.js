const express = require("express");
const { v4: uuidv4 } = require("uuid");
const sessionRouter = express.Router();
sessionRouter.post("/", (req, res) => { res.json({ sessionId: uuidv4(), createdAt: Date.now() }); });
sessionRouter.get("/:id", (req, res) => { res.json({ sessionId: req.params.id, active: true }); });
module.exports = { sessionRouter };
