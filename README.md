# 🤖 Autonomous AI Company Simulator

> A multi-agent workspace where AI roles collaborate to turn a high-level goal into a structured solution.

The simulator explores a simple question: **what happens when different AI agents are given different responsibilities instead of asking one model to do everything?**

## 🧠 The agent team

```text
                 USER GOAL
                     │
                     ▼
              ┌─────────────┐
              │     CEO     │  Strategy / decomposition
              └──────┬──────┘
                     │ context
          ┌──────────┴──────────┐
          ▼                     ▼
   ┌─────────────┐       ┌─────────────┐
   │  DEVELOPER  │       │   DESIGNER  │
   │ architecture│       │ UX / UI     │
   └──────┬──────┘       └──────┬──────┘
          └──────────┬──────────┘
                     ▼
               FINAL OUTPUT
```

### CEO — Strategic Planner
Breaks the user's goal into actionable requirements and priorities.

### Developer — Technical Lead
Turns the requirements into architecture and implementation ideas.

### Designer — UX/UI Lead
Focuses on interaction, usability and visual consistency.

## ⚡ What it demonstrates

- **Multi-agent orchestration** — specialized roles collaborate instead of one generic prompt.
- **Prompt chaining** — one agent's output becomes useful context for downstream agents.
- **Context management** — preserve relevant information while keeping each role focused.
- **Realtime interaction** — watch the reasoning workflow as the company simulation progresses.
- **AI-native UX** — the interface is designed around the workflow, not just a chat box.

## 🛠️ Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| UI | React 18 |
| Styling | Tailwind CSS |
| AI | LLM APIs + structured prompting |
| Runtime | Node.js 18+ |

## 🚀 Run locally

```bash
git clone https://github.com/sagar25446-prog/AI-AGENTS-.git
cd AI-AGENTS-
npm install
```

Create `.env.local` with the API configuration expected by the project, then:

```bash
npm run dev
```

Open `http://localhost:3000`.

## 🔬 Why I built it

This project is a compact experiment in **agentic software design**. It sits alongside my larger AI projects and helped me explore role separation, context passing and human-visible agent workflows.

## 👨‍💻 Author

**Sagar Hundia** · [GitHub](https://github.com/sagar25446-prog)

---

`one goal → multiple perspectives → one system`
