# 🤖 Autonomous AI Company Simulator (DevCorp AI)

[![Event](https://img.shields.io/badge/BharatCode-Build%20League%202026-orange?style=for-the-badge)](https://bharatcode.ai)
[![Powered by](https://img.shields.io/badge/Powered%20by-BharatCode%20Model%20API-blue?style=for-the-badge)](https://bharatcode.ai/api/model/v1)
[![Model](https://img.shields.io/badge/Model-Qwen%203.8%2027B%20%7C%20DeepSeek%20V4.1-purple?style=for-the-badge)](https://bharatcode.ai/models)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

> **A multi-agent autonomous workspace where specialized AI personas debate, plan, and build production-grade web applications from a single user prompt.**  
> Built for the **BharatCode Build League 2026** (Track: *Artificial Intelligence Agents & Productivity / Automation*).

---

## 🌟 Overview

Most AI tools try to do everything with a single prompt to a single model. **Autonomous AI Company Simulator** simulates an entire tech startup inside your browser:

Instead of asking one generic assistant to write an app, our autonomous pipeline spins up specialized agents:
1. **CEO (Atlas)** — Market positioning, goal decomposition, and business strategy.
2. **Project Manager (Marcus)** — Sprint velocity, phased roadmaps, and resource allocation.
3. **Product Manager (Sophia)** — User stories, feature priority, and acceptance criteria.
4. **UI/UX Designer (Luna)** — Visual design systems, dark mode palettes, and UX wireframes.
5. **Frontend Engineer (Kai)** — React/Tailwind component hierarchies and state architecture.
6. **Backend Engineer (Devon)** — RESTful API design, database schemas, and microservice orchestration.
7. **Database Architect (Elena)** — Indexing, relational modeling, and query optimization.
8. **DevOps Engineer (Jax)** — CI/CD pipelines, containerization, and deployment resilience.

---

## ⚡ The Autonomous Agent Pipeline

```text
                           USER PROMPT / IDEA
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │    1. Company Formation       │  Market positioning & vision
                   └───────────────┬───────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │    2. CEO Strategic Plan      │  Timeline & feature scoping
                   └───────────────┬───────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │    3. Product Requirements    │  User stories & edge cases
                   └───────────────┬───────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │    4. UI / UX Design System   │  Theme, layout & component specs
                   └───────────────┬───────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │    5. Frontend Architecture   │  Client logic & interactive state
                   └───────────────┬───────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │    6. Backend & Database      │  API contracts & data models
                   └───────────────┬───────────────┘
                                   │
                                   ▼
             🔥 [LIVE CODE GENERATION & INSTANT PREVIEW] 🔥
```

---

## 🇮🇳 BharatCode Model API Integration

This project directly leverages the **BharatCode Model API** (`https://bharatcode.ai/api/model/v1`) using standard OpenAI-compatible completions protocols.

### Key Capabilities Powered by BharatCode:
- **Autonomous Multi-Agent Debates (`/api/debates`):**  
  Agents don't just agree—they debate trade-offs (e.g., SQLite vs PostgreSQL, Tailwind vs CSS modules, MVP scope vs complete features). BharatCode models generate contextual, passionate engineering discussions tailored strictly to the user's idea.
- **Dynamic Full-Stack App Synthesizer (`/api/generate`):**  
  Converts the synthesized decisions into a standalone, interactive, single-file HTML/Tailwind/JavaScript application rendered instantly in an embedded sandbox.
- **Model Support:** Optimized for **Qwen 3.8 27B** (standard tier) with native compatibility for **BharatCode DeepSeek V4.1 Flash** (heavy reasoning tier).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI Inference** | **BharatCode Model API** (`/v1/chat/completions`) |
| **Framework** | Next.js 16 (App Router) |
| **State Management** | Zustand (Global reactive pipeline store) |
| **Styling & UI** | Tailwind CSS + Framer Motion (animated agent nodes) |
| **Icons** | Lucide React |
| **Language** | TypeScript |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/sagar25446-prog/AI-AGENTS-.git
cd AI-AGENTS-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Add your BharatCode credentials in `.env.local`:
```env
BHARATCODE_API_KEY=your_bharatcode_api_key_here
BHARATCODE_BASE_URL=https://bharatcode.ai/api/model/v1
BHARATCODE_MODEL=qwen-3.8-27b
```

*(Optional fallback: add `GEMINI_API_KEY` as a secondary redundancy provider).*

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```text
├── BharatCode.txt           # Official BharatCode Build League verification file
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── debates/     # BharatCode-powered agent debate engine
│   │   │   └── generate/    # BharatCode-powered interactive code synthesizer
│   │   ├── dashboard/       # Main agent arena & live code sandbox
│   │   └── page.tsx         # Landing page & idea input
│   ├── components/
│   │   ├── dashboard/       # AgentArena, CodeViewer, PipelineView
│   │   └── landing/         # HeroSection, HowItWorks, ParticleBackground
│   └── lib/
│       ├── bharatcode.ts    # Official BharatCode Model API client
│       ├── agents/          # Pipeline engine, agent profiles & types
│       └── store/           # Zustand state management
```

---

## 👨‍💻 Author

**Sagar Jain**  
- GitHub: [@sagar25446-prog](https://github.com/sagar25446-prog)  
- Portfolio: [sagar25446-prog.github.io](https://sagar25446-prog.github.io)

---

## 📜 License & Compliance

Submitted to the **BharatCode Build League 2026**. Open source under the MIT License.
