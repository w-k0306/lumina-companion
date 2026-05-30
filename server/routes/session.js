const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { listSessions, deleteSession } = require("../services/memory");
const sessionRouter = express.Router();

// 创建新会话
sessionRouter.post("/", (req, res) => {
  res.json({ sessionId: uuidv4(), createdAt: Date.now() });
});

// 获取会话信息
sessionRouter.get("/:id", (req, res) => {
  res.json({ sessionId: req.params.id, active: true });
});

// 列出所有会话
sessionRouter.get("/", (req, res) => {
  res.json({ sessions: listSessions() });
});

// 删除会话
sessionRouter.delete("/:id", (req, res) => {
  deleteSession(req.params.id);
  res.json({ ok: true });
});

module.exports = { sessionRouter };
