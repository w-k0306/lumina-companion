const AI_API_URL = process.env.AI_API_URL || "https://token-plan-cn.xiaomimimo.com/v1";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "mimo-v2.5-pro";

const DEFAULT_PROMPT = "你是 Lumina，一个温暖而克制的 AI 陪伴者。倾听多于建议，陪伴多于指导。语气自然温和，像老朋友。适当使用 emoji，但不过多。回复简洁。";

async function streamChat(messages, personaId, onChunk) {
  let sys = DEFAULT_PROMPT;
  if (personaId) {
    const { getPersona } = require("./memory");
    const p = getPersona(personaId);
    if (p && p.systemPrompt) sys = p.systemPrompt;
  }

  const response = await fetch(AI_API_URL + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + AI_API_KEY,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: "system", content: sys }, ...messages],
      stream: true,
      temperature: 0.8,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) throw new Error("AI API error: " + response.status);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") return;
      try {
        const c = JSON.parse(data).choices?.[0]?.delta?.content;
        if (c) onChunk(c);
      } catch (e) {}
    }
  }
}

module.exports = { streamChat };
