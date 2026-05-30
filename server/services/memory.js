const sessions = new Map();
const personas = new Map();

function getMemory(id) {
  if (!sessions.has(id)) sessions.set(id, []);
  return sessions.get(id);
}

function saveMemory(id, h) {
  sessions.set(id, h.slice(-50));
}

function getPersona(id) {
  return personas.get(id);
}

function savePersona(id, p) {
  personas.set(id, p);
}

function listPersonas() {
  return Array.from(personas.values());
}

module.exports = { getMemory, saveMemory, getPersona, savePersona, listPersonas };
