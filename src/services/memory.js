const sessions = new Map();

function getMemory(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}

function saveMemory(sessionId, history) {
  const trimmed = history.slice(-50);
  sessions.set(sessionId, trimmed);
}

function clearMemory(sessionId) {
  sessions.delete(sessionId);
}

module.exports = { getMemory, saveMemory, clearMemory };
