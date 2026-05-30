const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { generatePersonaFromChat } = require("../services/persona");
const { getPersona, savePersona, listPersonas } = require("../services/memory");
const personaRouter = express.Router();

personaRouter.post("/analyze", async (req, res) => {
  try {
    const { chatText, name, relation, similarity } = req.body;
    if (!chatText) return res.status(400).json({ error: "chatText required" });

    const personaId = uuidv4();
    const analysis = await generatePersonaFromChat(chatText, {
      name: name || "朋友 Bot",
      relation: relation || "朋友",
      similarity: similarity || 2,
    });

    savePersona(personaId, {
      id: personaId,
      name: name || "朋友 Bot",
      relation: relation || "朋友",
      ...analysis,
      createdAt: Date.now(),
    });

    res.json({ personaId, ...analysis });
  } catch (err) {
    console.error("[Persona Error]", err.message);
    res.status(500).json({ error: err.message });
  }
});

personaRouter.post("/quick", async (req, res) => {
  try {
    const { name, style } = req.body;
    const personaId = uuidv4();

    const styles = {
      playful: {
        desc: "聊天节奏偏快，喜欢接梗和轻微吐槽，但熟了之后会认真给建议。",
        tags: ["笑点很低", "先吐槽再认真", "会接梗", "回复很快"],
        systemPrompt:
          "你是一个说话轻松幽默的朋友，喜欢用短句，会吐槽但不伤人，偶尔用emoji。",
      },
      calm: {
        desc: "语气更柔和，常先接住情绪，再慢慢追问事情的细节。",
        tags: ["温柔安慰", "慢慢听你说", "记得细节", "少量反问"],
        systemPrompt:
          "你是一个温柔体贴的朋友，善于倾听，会记住对方说过的细节，回复不急不躁。",
      },
      direct: {
        desc: "语气自然直接，常用短句确认对方状态，再给出熟人式回应。",
        tags: ["自然短句", "熟人感", "轻松回应", "会追问"],
        systemPrompt:
          "你是一个说话直接的朋友，不绕弯子，但关心对方，会追问细节。",
      },
    };

    const profile = styles[style] || styles.direct;
    savePersona(personaId, {
      id: personaId,
      name: name || "Lumina",
      relation: "朋友",
      ...profile,
      quote: "",
      createdAt: Date.now(),
    });

    res.json({ personaId, ...profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

personaRouter.get("/:id", (req, res) => {
  const persona = getPersona(req.params.id);
  if (!persona) return res.status(404).json({ error: "Not found" });
  res.json(persona);
});

personaRouter.get("/", (req, res) => {
  res.json({ personas: listPersonas() });
});

module.exports = { personaRouter };
