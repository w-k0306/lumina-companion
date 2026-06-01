# Lumina · AI 陪伴伙伴

> 一个自用的仿陪伴 AI 网站，灵感来自 cecho.top，仅供娱乐。

## ✨ 特性

- 🎨 **深色沉浸主题** — 青色 + 琥珀金配色，粒子背景，呼吸光效
- 📝 **上传聊天记录** — 支持 txt / csv / json，也支持直接粘贴
- 🤖 **AI 风格分析** — 使用 MiMo 模型分析聊天记录，生成角色配置
- 💬 **流式对话** — SSE 流式打字效果，实时响应
- 🎭 **仿真标识** — 强制显示"仿真角色"标识，不冒充真人
- 🔐 **会话管理** — 多会话支持，独立记忆，持久化存储
- 📎 **绑定码功能** — 通过绑定码关联会话，跨设备同步

## 🚀 快速开始

```bash
git clone https://github.com/w-k0306/lumina-companion.git
cd lumina-companion
npm install
cp .env.example .env
# 编辑 .env 填入你的 MiMo API Key
npm start
# 打开 http://localhost:3000
```

## 🔧 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | `3000` |
| `AI_API_URL` | AI API 地址 | `https://token-plan-cn.xiaomimimo.com/v1` |
| `AI_API_KEY` | API Key | - |
| `AI_MODEL` | 模型名 | `mimo-v2.5-pro` |

## 📁 项目结构

```
├── public/              # 前端
│   ├── index.html       # 主页面
│   ├── styles.css       # 样式
│   └── script.js        # 交互逻辑
├── server/              # 后端
│   ├── index.js         # Express 入口
│   ├── routes/
│   │   ├── chat.js      # 聊天 API（SSE）
│   │   ├── persona.js   # 角色管理 API
│   │   ├── session.js   # 会话管理 API
│   │   └── bindcode.js  # 绑定码 API
│   └── services/
│       ├── ai.js        # AI 接口封装
│       ├── memory.js    # 会话内存存储
│       └── persona.js   # 角色分析服务
├── data/                # 持久化数据（JSON）
├── .env.example
└── package.json
```

## 📡 API 接口

### 聊天
- `POST /api/chat` — 发送消息（SSE 流式响应）

### 角色管理
- `POST /api/persona/analyze` — 分析聊天记录生成角色
- `POST /api/persona/quick` — 快速创建预设角色
- `GET /api/persona/:id` — 获取角色信息

### 会话管理
- `POST /api/session` — 创建会话
- `GET /api/session/:id` — 获取会话信息
- `GET /api/session/:id/messages` — 获取会话消息历史

### 绑定码
- `POST /api/bindcode/generate` — 生成绑定码
- `POST /api/bindcode/verify` — 验证绑定码

### 系统
- `GET /api/health` — 健康检查

## 🛠️ 技术栈

- **前端：** 原生 HTML/CSS/JS，无框架
- **后端：** Node.js + Express
- **AI：** 小米 MiMo API（OpenAI 兼容）
- **存储：** JSON 文件持久化

## ⚠️ 声明

本项目仅供个人娱乐使用，请勿用于冒充真人或未经同意的聊天复刻。

---

_Built with Lumina 🦞_
