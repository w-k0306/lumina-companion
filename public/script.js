// ===== Lumina Frontend =====
const API_BASE = window.location.origin + "/api";

// ===== 粒子背景 =====
(function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
      ctx.fill();
    }

    // 连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();

// ===== 导航滚动效果 =====
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== API =====
async function apiPost(endpoint, body) {
  const res = await fetch(API_BASE + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// ===== 角色生成 =====
const chatText = document.querySelector("#chatText");
const personaName = document.querySelector("#personaName");
const generateBtn = document.querySelector("#generateBtn");
const cardName = document.querySelector("#cardName");
const cardDesc = document.querySelector("#cardDesc");
const cardAvatar = document.querySelector("#cardAvatar");
const tagList = document.querySelector("#tagList");
const quoteCard = document.querySelector("#quoteCard");
const chatName = document.querySelector("#chatName");
const chatAvatar = document.querySelector("#chatAvatar");

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
    const el = document.createElement("span");
    el.textContent = tag;
    tagList.appendChild(el);
  });
}

generateBtn.addEventListener("click", async () => {
  generateBtn.disabled = true;
  generateBtn.textContent = "生成中...";

  try {
    const name = personaName.value.trim() || "朋友 Bot";

    // 先尝试调用 AI 分析
    if (chatText.value.trim().length > 10) {
      const result = await apiPost("/persona/analyze", {
        chatText: chatText.value,
        name,
        relation: document.querySelector("#relation").value,
        similarity: document.querySelector("#similarity").value,
      });

      if (!result.error) {
        cardName.textContent = name;
        chatName.textContent = name;
        cardDesc.textContent = result.desc;
        quoteCard.textContent = `"${result.quote}"`;
        cardAvatar.textContent = name[0];
        chatAvatar.textContent = name[0];
        renderTags(result.tags);
        window.currentPersonaId = result.personaId;
        document.querySelector("#chat-section").scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // fallback: 本地分析
    const profile = pickProfile(chatText.value);
    cardName.textContent = name;
    chatName.textContent = name;
    cardDesc.textContent = profile.desc;
    quoteCard.textContent = `"${profile.quote}"`;
    cardAvatar.textContent = name[0];
    chatAvatar.textContent = name[0];
    renderTags(profile.tags);
    document.querySelector("#chat-section").scrollIntoView({ behavior: "smooth" });
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "生成角色卡";
  }
});

// ===== 聊天 =====
const chatStream = document.querySelector("#chatStream");
const chatForm = document.querySelector("#chatForm");
const messageInput = document.querySelector("#messageInput");

let sessionId = "session-" + Date.now();

function addBubble(text, type) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  chatStream.appendChild(bubble);
  chatStream.scrollTop = chatStream.scrollHeight;
  return bubble;
}

function addTyping() {
  const el = document.createElement("div");
  el.className = "bubble bot typing-bubble";
  el.innerHTML = "<span></span><span></span><span></span>";
  el.style.cssText =
    "display:flex;gap:5px;padding:12px 16px;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.12);border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start;";
  el.querySelectorAll("span").forEach((s) => {
    s.style.cssText =
      "width:6px;height:6px;border-radius:50%;background:#38bdf8;animation:dotBounce 1.2s infinite ease-in-out;";
  });
  chatStream.appendChild(el);
  chatStream.scrollTop = chatStream.scrollHeight;
  return el;
}

async function sendMessage(message) {
  addBubble(message, "user");
  const typing = addTyping();

  try {
    const response = await fetch(API_BASE + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message,
        personaId: window.currentPersonaId || null,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let botBubble = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "chunk") {
            if (!botBubble) {
              typing.remove();
              botBubble = addBubble("", "bot");
            }
            fullText += data.content;
            botBubble.textContent = fullText;
            chatStream.scrollTop = chatStream.scrollHeight;
          } else if (data.type === "error") {
            typing.remove();
            addBubble("⚠️ " + data.content, "bot");
          }
        } catch (e) {}
      }
    }

    if (!botBubble) {
      typing.remove();
      addBubble("（无响应）", "bot");
    }
  } catch (err) {
    typing.remove();
    addBubble("连接失败，请检查服务是否启动", "bot");
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (!msg) return;
  messageInput.value = "";
  sendMessage(msg);
});

// 快捷提示
document.querySelectorAll("[data-prompt]").forEach((btn) => {
  btn.addEventListener("click", () => {
    messageInput.value = btn.dataset.prompt;
    messageInput.focus();
  });
});
