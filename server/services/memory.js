const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../../data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const PERSONAS_FILE = path.join(DATA_DIR, "personas.json");

// 确保 data 目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ===== 通用读写 =====
function readJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error(`[Store] 读取 ${filePath} 失败:`, e.message);
    return fallback;
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error(`[Store] 写入 ${filePath} 失败:`, e.message);
  }
}

// ===== 内存缓存（启动时加载，操作后写回） =====
let sessionsCache = readJSON(SESSIONS_FILE, {});
let personasCache = readJSON(PERSONAS_FILE, {});

function flushSessions() {
  writeJSON(SESSIONS_FILE, sessionsCache);
}

function flushPersonas() {
  writeJSON(PERSONAS_FILE, personasCache);
}

// ===== 聊天记录 =====
function getMemory(sessionId) {
  if (!sessionsCache[sessionId]) {
    sessionsCache[sessionId] = [];
  }
  return sessionsCache[sessionId];
}

function saveMemory(sessionId, history) {
  // 保留最近 50 条
  sessionsCache[sessionId] = history.slice(-50);
  flushSessions();
}

function listSessions() {
  return Object.keys(sessionsCache).map((id) => ({
    sessionId: id,
    messageCount: sessionsCache[id].length,
    lastMessage: sessionsCache[id].length
      ? sessionsCache[id][sessionsCache[id].length - 1]
      : null,
  }));
}

function deleteSession(sessionId) {
  delete sessionsCache[sessionId];
  flushSessions();
}

// ===== 角色 =====
function getPersona(id) {
  return personasCache[id] || null;
}

function savePersona(id, persona) {
  personasCache[id] = persona;
  flushPersonas();
}

function listPersonas() {
  return Object.values(personasCache);
}

function deletePersona(id) {
  delete personasCache[id];
  flushPersonas();
}

module.exports = {
  getMemory,
  saveMemory,
  listSessions,
  deleteSession,
  getPersona,
  savePersona,
  listPersonas,
  deletePersona,
};
