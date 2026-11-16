# Task List: AI Text Assistant Full-Stack Project

Track progress across each phase of the project.

---

## Phase 1: Environment & Directory Scaffolding
- [x] Initialize root directory structure: `backend/`, `frontend/`, `docs/`
- [x] Initialize Express.js backend project with TypeScript and ESM
- [x] Create Next.js 15 frontend application with Tailwind CSS and Lucide React
- [x] Create `backend/.env.example` and `backend/.env` templates for Neon DB and OpenAI configurations

---

## Phase 2: Database Layer with Neon DB & Prisma
- [x] Install Prisma CLI and client (`@prisma/client`, `prisma`)
- [x] Define Prisma schema for `Session` and `Message` models in `backend/prisma/schema.prisma`
- [x] Configure Neon DB SSL connection string validation in `backend/src/config/db.ts`
- [x] Implement database connection health check (fail fast with descriptive error if Neon DB is unreachable)
- [x] Generate Prisma Client (`npx prisma generate`)
- [x] Push schema to Neon DB (`npx prisma db push`)

---

## Phase 3: Backend API Development & OpenAI Integration
- [x] Implement Express app entry point (`backend/src/index.ts`) with CORS and JSON middleware
- [x] Implement LLM Service (`backend/src/services/llm.service.ts`):
  - [x] OpenAI SDK Chat Completions integration
  - [x] Context window history assembly
  - [x] Hyperparameter support (`temperature`, `max_tokens`, `model`)
  - [x] Structured JSON output support (`response_format: { type: "json_object" }`)
  - [x] Realistic simulated mock LLM fallback (token calculation, simulated latency, valid structured responses)
  - [x] Latency tracking and token consumption metrics
- [x] Implement Session Controller & Routes (`backend/src/controllers/session.controller.ts`):
  - [x] `GET /api/sessions` (list sessions)
  - [x] `POST /api/sessions` (create session)
  - [x] `GET /api/sessions/:id` (fetch session with message history)
  - [x] `PATCH /api/sessions/:id/config` (update session settings)
  - [x] `DELETE /api/sessions/:id` (delete session)
- [x] Implement Chat Controller & Route (`backend/src/controllers/chat.controller.ts`):
  - [x] `POST /api/sessions/:id/messages` (process message, execute LLM, record metrics, save to Neon DB)
- [x] Implement Health Route:
  - [x] `GET /api/health` (verify Neon DB and AI provider status)

---

## Phase 4: Frontend Development (Next.js)
- [x] Create layout and theme with modern dark/light styling
- [x] Build **Sidebar** component:
  - [x] Session list with active indicator
  - [x] "New Chat" button
  - [x] Delete conversation button
  - [x] Neon DB live connection status indicator
- [x] Build **Chat Window** component:
  - [x] Message history stream with role avatars (User, Assistant)
  - [x] Markdown message rendering with code formatting
  - [x] Formatted JSON viewer for structured responses (collapsible, syntax highlighted, copy button)
  - [x] Multi-line input area with keyboard submission (`Enter` / `Shift+Enter`)
  - [x] Loading state indicator during generation
- [x] Build **Settings Drawer / Modal**:
  - [x] System prompt editor with 4 presets (General Assistant, Code Reviewer, Socratic Tutor, JSON Extractor)
  - [x] Temperature slider (0.0 to 2.0) with real-time explanatory tooltip
  - [x] Structured JSON output mode toggle
  - [x] Model selector (`gpt-4o-mini`, `gpt-4o`)
- [x] Build **Educational Inspector Panel**:
  - [x] Real-time token consumption breakdown (prompt tokens, completion tokens, total tokens)
  - [x] Latency display in milliseconds
  - [x] Raw prompt inspector showing the exact messages array payload sent to the LLM
  - [x] Guide tabs explaining LLM Fundamentals, Behavior, and Prompt Engineering in relation to the active chat

---

## Phase 5: Verification & Integration Testing
- [x] Verify Neon DB connection and table push
- [x] Verify `GET /api/health` returns healthy Neon DB connection
- [x] Test standard conversational messaging and context memory across turns
- [x] Test system prompt persona customization
- [x] Test temperature changes (deterministic vs exploratory)
- [x] Test structured JSON mode response validation
- [x] Run automated build check (`npm run build`) in Next.js
- [x] Verify full UI responsiveness and zero console errors

---

## Phase 6: Documentation & Educational Walkthrough
- [x] Create `walkthrough.md` with instructions on running the project, connecting Neon DB, adding OpenAI API keys, and testing all educational concepts
