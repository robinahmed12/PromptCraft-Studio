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
- [ ] Install Prisma CLI and client (`@prisma/client`, `prisma`)
- [ ] Define Prisma schema for `Session` and `Message` models in `backend/prisma/schema.prisma`
- [ ] Configure Neon DB SSL connection string validation in `backend/src/config/db.ts`
- [ ] Implement database connection health check (fail fast with descriptive error if Neon DB is unreachable)
- [ ] Push schema to Neon DB (`npx prisma db push`) and generate Prisma Client

---

## Phase 3: Backend API Development & OpenAI Integration
- [ ] Implement Express app entry point (`backend/src/index.ts`) with CORS and JSON middleware
- [ ] Implement LLM Service (`backend/src/services/llm.service.ts`):
  - [ ] OpenAI SDK Chat Completions integration
  - [ ] Context window history assembly
  - [ ] Hyperparameter support (`temperature`, `max_tokens`, `model`)
  - [ ] Structured JSON output support (`response_format: { type: "json_object" }`)
  - [ ] Realistic simulated mock LLM fallback (token calculation, simulated latency, valid structured responses)
  - [ ] Latency tracking and token consumption metrics
- [ ] Implement Session Controller & Routes (`backend/src/controllers/session.controller.ts`):
  - [ ] `GET /api/sessions` (list sessions)
  - [ ] `POST /api/sessions` (create session)
  - [ ] `GET /api/sessions/:id` (fetch session with message history)
  - [ ] `PATCH /api/sessions/:id/config` (update session settings)
  - [ ] `DELETE /api/sessions/:id` (delete session)
- [ ] Implement Chat Controller & Route (`backend/src/controllers/chat.controller.ts`):
  - [ ] `POST /api/sessions/:id/messages` (process message, execute LLM, record metrics, save to Neon DB)
- [ ] Implement Health Route:
  - [ ] `GET /api/health` (verify Neon DB and AI provider status)

---

## Phase 4: Frontend Development (Next.js)
- [ ] Create layout and theme with modern dark/light styling
- [ ] Build **Sidebar** component:
  - [ ] Session list with active indicator
  - [ ] "New Chat" button
  - [ ] Delete conversation button
  - [ ] Neon DB live connection status indicator
- [ ] Build **Chat Window** component:
  - [ ] Message history stream with role avatars (User, Assistant)
  - [ ] Markdown message rendering with code formatting
  - [ ] Formatted JSON viewer for structured responses (collapsible, syntax highlighted, copy button)
  - [ ] Multi-line input area with keyboard submission (`Enter` / `Shift+Enter`)
  - [ ] Loading state indicator during generation
- [ ] Build **Settings Drawer / Modal**:
  - [ ] System prompt editor with 4 presets (General Assistant, Code Reviewer, Socratic Tutor, JSON Extractor)
  - [ ] Temperature slider (0.0 to 2.0) with real-time explanatory tooltip
  - [ ] Structured JSON output mode toggle
  - [ ] Model selector (`gpt-4o-mini`, `gpt-4o`)
- [ ] Build **Educational Inspector Panel**:
  - [ ] Real-time token consumption breakdown (prompt tokens, completion tokens, total tokens)
  - [ ] Latency display in milliseconds
  - [ ] Raw prompt inspector showing the exact messages array payload sent to the LLM
  - [ ] Guide tabs explaining LLM Fundamentals, Behavior, and Prompt Engineering in relation to the active chat

---

## Phase 5: Verification & Integration Testing
- [ ] Verify Neon DB connection and table push
- [ ] Verify `GET /api/health` returns healthy Neon DB connection
- [ ] Test standard conversational messaging and context memory across turns
- [ ] Test system prompt persona customization
- [ ] Test temperature changes (deterministic vs exploratory)
- [ ] Test structured JSON mode response validation
- [ ] Run automated build check (`npm run build`) in Next.js
- [ ] Verify full UI responsiveness and zero console errors

---

## Phase 6: Documentation & Educational Walkthrough
- [ ] Create `walkthrough.md` with instructions on running the project, connecting Neon DB, adding OpenAI API keys, and testing all educational concepts
