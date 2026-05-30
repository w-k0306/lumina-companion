const AI_API_URL = process.env.AI_API_URL || "https://token-plan-cn.xiaomimimo.com/v1";
const AI_API_KEY = process.env.AI_API_KEY || "";
const AI_MODEL = process.env.AI_MODEL || "mimo-v2.5-pro";

async function generatePersonaFromChat(chatText, options) {
  const prompt = `分析以下聊天记录，提取说话人的语言风格特征。

聊天记录：
${chatText.substring(0, 3000)}

请返回JSON格式：
{ "desc": "一句话描述说话风格", "tags": ["特征1","特征2","特征3","特征4"], "quote": "最能代表TA风格的一句话", "systemPrompt": "让AI模仿这个人的说话方式的system prompt" }`;

  const response = await fetch(AI_API_URL + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + AI_API_KEY,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: "system", content: "只返回JSON，不要其他内容。" },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) throw new Error("Analysis failed");

  const result = await response.json();
  try {
    return JSON.parse(
      result.choices[0].message.content
        .replace(/```json\n?/g, "")
        .replace(/```/g, "")
        .trim()
    );
  } catch (e) {
    return {
      desc: "语气自然直接，常用短句，熟人式回应。",
      tags: ["自然短句", "熟人感", "轻松回应", "会追问"],
      quote: "你继续说，我听着呢。",
      systemPrompt: "你是一个说话自然的朋友，语气直接但不冷漠。",
    };
  }
}

module.exports = { generatePersonaFromChat };
