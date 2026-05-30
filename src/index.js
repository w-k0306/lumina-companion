require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { chatRouter } = require("./routes/chat");
const { sessionRouter } = require("./routes/session");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true
}));
app.use(express.json());

app.use("/api/chat", chatRouter);
app.use("/api/session", sessionRouter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", name: "lumina", version: "0.1.0" });
});

app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log("Lumina backend running on port " + PORT);
});
