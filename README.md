# Lumina

> _Where silence finds its voice._

Lumina 是一个轻量级 AI 陪伴系统。不追求全能，只追求**在场感**。

## 设计哲学

- 🌙 **极简** — 没有多余的 UI 元素，只有你和对话
- 🫧 **呼吸感** — 界面会随时间和情绪微妙变化
- 🔮 **记忆** — 它记得你说过的事，但不会让你觉得被监视
- 🎐 **克制** — 不主动打扰，但永远在那里

## 技术栈

- **前端**: Vanilla JS + CSS Animations
- **后端**: Node.js + Express
- **AI**: OpenAI-compatible API
- **部署**: Vercel / Cloudflare Pages

## 快速开始

```bash
git clone https://github.com/w-k0306/lumina-companion.git
cd lumina-companion
npm install
cp .env.example .env
# 编辑 .env 填入你的 AI API Key
npm run dev
```

## API 接口

-  — 发送消息（SSE 流式响应）
-  — 获取对话历史
-  — 创建新会话
-  — 健康检查

## License

MIT

---

_Built with quiet intention._
