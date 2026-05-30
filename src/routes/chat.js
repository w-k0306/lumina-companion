const express = require("express");
const { streamChat } = require("../services/ai");
const { getMemory, saveMemory } = require("../services/memory");
const chatRouter = express.Router();

chatRouter.post("/", async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message required" });
    }

    const history = getMemory(sessionId);
    history.push({ role: "user", content: message });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    await streamChat(history, (chunk) => {
      fullResponse += chunk;
      res.write("data: " + JSON.stringify({ type: "chunk", content: chunk }) + "\n\n");
    });

    history.push({ role: "assistant", content: fullResponse });
    saveMemory(sessionId, history);

    res.write("data: " + JSON.stringify({ type: "done" }) + "\n\n");
    res.end();
  } catch (err) {
    console.error("[Chat Error]", err.message);
    res.write("data: " + JSON.stringify({ type: "error", content: err.message }) + "\n\n");
    res.end();
  }
});

chatRouter.get("/history/:sessionId", (req, res) => {
  const history = getMemory(req.params.sessionId);
  res.json({ history });
});

module.exports = { chatRouter };
