// === Lumina Backend API ===
const API_BASE = window.location.origin + "/api";

async function apiPost(endpoint, body) {
  const res = await fetch(API_BASE + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function apiGet(endpoint) {
  const res = await fetch(API_BASE + endpoint);
  return res.json();
}

const chatText = document.querySelector("#chatText");
const personaName = document.querySelector("#personaName");
const generateBtn = document.querySelector("#generateBtn");
const cardName = document.querySelector("#cardName");
const cardDesc = document.querySelector("#cardDesc");
const tagList = document.querySelector("#tagList");
const quoteCard = document.querySelector("#quoteCard");
const chatName = document.querySelector("#chatName");
const chatStream = document.querySelector("#chatStream");
const chatForm = document.querySelector("#chatForm");
const messageInput = document.querySelector("#messageInput");

const defaultTags = ["嘴硬心软", "爱吐槽", "短句回复", "熟人语气"];
const playfulTags = ["笑点很低", "先吐槽再认真", "会接梗", "回复很快"];
const calmTags = ["温柔安慰", "慢慢听你说", "记得细节", "少量反问"];

function pickProfile(text) {
  const source = text.trim();
  if (!source) {
    return {
      desc: "偏熟人聊天，短句多，喜欢先吐槽再认真回应。",
      tags: defaultTags,
      quote: "你先别急，我感觉有点靠谱但也有点离谱。",
    };
  }

  const isPlayful = /笑死|哈哈|离谱|我服|救命|绷不住/.test(source);
  const isCalm = /没事|慢慢|抱抱|辛苦|别怕|陪你/.test(source);

  if (isPlayful) {
    return {
      desc: "聊天节奏偏快，喜欢接梗和轻微吐槽，但熟了之后会认真给建议。",
      tags: playfulTags,
      quote: "笑死，你这个想法有点抽象，但我居然觉得可以试试。",
    };
  }

  if (isCalm) {
    return {
      desc: "语气更柔和，常先接住情绪，再慢慢追问事情的细节。",
      tags: calmTags,
      quote: "你先缓一下，慢慢说，我在听。",
    };
  }

  return {
    desc: "语气自然直接，常用短句确认对方状态，再给出熟人式回应。",
    tags: ["自然短句", "熟人感", "轻松回应", "会追问"],
    quote: "真的假的？你展开讲讲，我感觉这事没那么简单。",
  };
}

function renderTags(tags) {
  tagList.innerHTML = "";
  tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    tagList.append(item);
  });
}

generateBtn.addEventListener("click", () => {
  const profile = pickProfile(chatText.value);
  const name = personaName.value.trim() || "朋友 Bot";
  cardName.textContent = name;
  chatName.textContent = name;
  cardDesc.textContent = profile.desc;
  quoteCard.textContent = `“${profile.quote}”`;
  renderTags(profile.tags);
  document.querySelector("#chat").scrollIntoView({ behavior: "smooth" });
});

function botReply(message) {
  if (/吃|饭|饿|奶茶/.test(message)) {
    return "你先别急，我投一票热乎的。别又随便糊弄一顿，然后半夜说饿。";
  }
  if (/累|烦|崩|难受/.test(message)) {
    return "那今天先别硬撑了。你可以先骂两句，我负责听，等你缓过来我们再想办法。";
  }
  if (/靠谱吗|决定|选择|要不要/.test(message)) {
    return "我觉得可以试，但别一把梭。先搞个小版本，能跑起来再说，别上来就把自己累死。";
  }
  return "你这个我有点想笑，但也不是不行。你继续说，我看看能不能帮你把它捋顺。";
}

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatStream.append(bubble);
  chatStream.scrollTop = chatStream.scrollHeight;
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  addBubble(message, "user");
  messageInput.value = "";
  window.setTimeout(() => addBubble(botReply(message), "bot"), 520);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    messageInput.value = button.dataset.prompt;
    messageInput.focus();
  });
});