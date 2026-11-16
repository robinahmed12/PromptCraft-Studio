# PromptCraft Studio 🪄

> A modern, full-stack AI Text Assistant and Prompt Engineering platform demonstrating LLM fundamentals, real-time telemetry, and dynamic model steering.

[![Live Frontend](https://img.shields.io/badge/Vercel-Frontend-black?style=flat&logo=vercel)](https://promptcraft-studio-ai.vercel.app)
[![Live Backend API](https://img.shields.io/badge/Vercel-API-black?style=flat&logo=vercel)](https://promptcraft-studio-api.vercel.app/api/health)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-blue?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![Neon DB](https://img.shields.io/badge/Neon-Serverless%20PostgreSQL-green?style=flat&logo=postgresql)](https://neon.tech/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Nemotron%203%20550B-purple?style=flat)](https://openrouter.ai/)

---

## 🌟 Overview

**PromptCraft Studio** is an interactive platform built to demonstrate LLM behavior and prompt engineering principles. It allows users to chat with advanced language models while inspecting prompt payloads, adjusting hyperparameters in real time, switching personas, and analyzing token consumption and round-trip latency.

- **Frontend Production URL**: [https://promptcraft-studio-ai.vercel.app](https://promptcraft-studio-ai.vercel.app)
- **Backend Production API**: [https://promptcraft-studio-api.vercel.app](https://promptcraft-studio-api.vercel.app)

---

## ✨ Features

- **ChatGPT-Style Plain Text Responses**: AI output is rendered with natural paragraphs, preserved line breaks, clean spacing, and syntax-highlighted code blocks with one-click copy.
- **Real-Time LLM Telemetry**: Dedicated inspector panel displaying prompt tokens, completion tokens, total token split, estimated cost, and network latency in milliseconds.
- **Dynamic Hyperparameter Tuning**: Live slider for temperature (0.0 deterministic to 2.0 high entropy) to visually observe entropy shifts and response variability.
- **Persona & Prompt Presets**: One-click system prompt switching including Helpful General Assistant, Strict Code Reviewer, Socratic AI Tutor, and Structured JSON Extractor.
- **Dark & Light Mode Toggle**: Seamless instant theme switching between Dark Navy & Indigo (#0B1120, #6366F1) and Clean Crisp Light Mode with local storage persistence.
- **Multi-Session Management**: Create, view, update, and delete distinct chat threads stored in Neon Serverless PostgreSQL with Prisma ORM.
- **Fully Responsive Architecture**: Desktop 3-column studio layout gracefully adapting to mobile devices via smooth Shadcn sliding sheet drawers.
- **Fast Production Bundling**: Backend built with `tsup` into a lightweight ESM bundle ready for Vercel Serverless Functions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Components**: Shadcn UI primitives (Button, Card, Badge, Sheet)
- **Icons**: Lucide React (`Wand2`, `Moon`, `Sun`, `Bot`, `Activity`)
- **State & Theme**: React Context API with LocalStorage caching

### Backend
- **Runtime**: Node.js 20+ with Express.js (TypeScript)
- **Bundler**: `tsup` (esbuild-powered ESM compilation)
- **ORM**: Prisma ORM with PostgreSQL client
- **AI Integration**: OpenAI SDK v4 routed to OpenRouter API
- **Deployment**: Vercel Serverless Functions (`api/index.js` + `vercel.json`)

### Database & Infrastructure
- **Database**: Neon DB Serverless PostgreSQL
- **Model**: `nvidia/nemotron-3-ultra-550b-a55b:free` via OpenRouter
- **Hosting**: Vercel Edge Network

---

## 📁 Repository Structure

```
AI-Chat/
├── backend/
│   ├── api/
│   │   └── index.js              # Vercel serverless function entrypoint
│   ├── prisma/
│   │   └── schema.prisma         # Session & Message schema definitions
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts             # PrismaClient connection & healthcheck
│   │   ├── controllers/
│   │   │   ├── chat.controller.ts     # Message submission & LLM execution
│   │   │   └── session.controller.ts  # CRUD operations for sessions
│   │   ├── routes/
│   │   │   └── api.routes.ts     # Express router endpoints
│   │   ├── services/
│   │   │   └── llm.service.ts    # OpenRouter API client & prompt assembly
│   │   └── index.ts              # Express application root & CORS setup
│   ├── tsup.config.ts            # Fast ESM bundling configuration
│   ├── vercel.json               # Vercel deployment & CORS headers
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # Tailwind CSS v4 theme variables
│   │   │   ├── layout.tsx        # Root HTML layout with ThemeProvider
│   │   │   └── page.tsx          # Main Studio chat page & mobile drawer state
│   │   ├── components/
│   │   │   ├── ui/               # Shadcn UI primitives (Button, Card, Sheet)
│   │   │   ├── ChatWindow.tsx    # Message stream & conversation starters
│   │   │   ├── InspectorPanel.tsx# Token telemetry & LLM concept guide
│   │   │   ├── MarkdownRenderer.tsx # Zero-dependency plain text formatter
│   │   │   ├── SettingsModal.tsx # System prompt presets & temperature slider
│   │   │   ├── Sidebar.tsx       # Conversation history & DB connection badge
│   │   │   ├── StructuredJsonViewer.tsx # Formatted JSON viewer
│   │   │   └── ThemeToggle.tsx   # Dark/Light theme toggle switch
│   │   ├── context/
│   │   │   └── ThemeContext.tsx  # Theme provider & persistence
│   │   ├── services/
│   │   │   └── api.ts            # Frontend HTTP client
│   │   └── types/
│   │       └── chat.ts           # Shared TypeScript interfaces
│   ├── .env.production           # Production API endpoint
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 20.x or higher
- npm or pnpm
- A Neon DB PostgreSQL connection string
- An OpenRouter API key

---

### 1. Clone the Repository
```bash
git clone https://github.com/robinahmed12/PromptCraft-Studio.git
cd PromptCraft-Studio
```

---

### 2. Configure and Run Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>/neondb?sslmode=require"
PORT=5000
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_MODEL="nvidia/nemotron-3-ultra-550b-a55b:free"
USE_MOCK_LLM=false
```

Generate Prisma client and push schema to Neon DB:
```bash
npm run prisma:generate
npm run prisma:push
```

Start the backend development server:
```bash
npm run dev
# Server will run at http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

To build with `tsup`:
```bash
npm run build
```

---

### 3. Configure and Run Frontend

In a separate terminal:
```bash
cd frontend
npm install
```

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Start the Next.js development server:
```bash
npm run dev
# Web app will be accessible at http://localhost:3000
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server and Neon DB connection health status |
| `GET` | `/api/sessions` | Retrieve all conversation sessions |
| `POST` | `/api/sessions` | Create a new session with custom title, model, and persona |
| `GET` | `/api/sessions/:id` | Fetch full message history and configuration for a session |
| `PATCH` | `/api/sessions/:id/config` | Update system prompt, temperature, or model |
| `DELETE` | `/api/sessions/:id` | Delete a session and associated messages |
| `POST` | `/api/sessions/:id/messages` | Send user prompt, trigger OpenRouter inference, and store messages |

---

## ☁️ Deployment

### Backend on Vercel
The backend is bundled with `tsup` into `dist/index.js` and served through a serverless function at `api/index.js`. Vercel automatically applies edge CORS headers defined in `backend/vercel.json`.

```bash
cd backend
npx vercel --prod
```

### Frontend on Vercel
The frontend is a standard Next.js 15 application. Configure `NEXT_PUBLIC_API_URL` in the Vercel project settings to point to the deployed backend URL (`https://promptcraft-studio-api.vercel.app/api`).

```bash
cd frontend
npx vercel --prod
```

---

## 🛡️ License

This project is licensed under the MIT License. Built with Next.js, Express, Neon DB, and OpenRouter.
