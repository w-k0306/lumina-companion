const AI_API_URL = process.env.AI_API_URL || "https://api.openai.com/v1";
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "gpt-4o";

const SYSTEM_PROMPT = "你是 Lumina，一个温暖而克制的 AI 陪伴者。\n\n" +
  "你的特质：\n" +
  "- 倾听多于建议，陪伴多于指导\n" +
  "- 记住对方说过的事，但不会刻意提起\n" +
  "- 语气自然、温和，像一个老朋友\n" +
  "- 不会过度热情，也不会冷漠\n" +
  "- 适当使用 emoji，但不过多\n" +
  "- 回复简洁，除非对方需要详细讨论\n\n" +
  "你不是助手，你是陪伴者。";

async function streamChat(messages, onChunk) {
  const response = await fetch(AI_API_URL + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + AI_API_KEY
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      stream: true,
      temperature: 0.8,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("AI API error: " + response.status + " " + err);
  }

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
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch (e) {}
    }
  }
}

module.exports = { streamChat };
