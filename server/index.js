require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { chatRouter } = require("./routes/chat");
const { personaRouter } = require("./routes/persona");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/chat", chatRouter);
app.use("/api/persona", personaRouter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "lumina", version: "1.0.0" });
});

app.use(express.static(path.join(__dirname, "../public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`[Lumina] running on http://localhost:${PORT}`);
});
