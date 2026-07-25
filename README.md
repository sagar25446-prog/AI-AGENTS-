# Autonomous AI Company Simulator

An interactive web application where multiple autonomous AI agents collaborate to simulate a functioning company. Built with **Next.js**, **React**, and integrated with Large Language Models (LLMs) to demonstrate multi-agent orchestration, prompt chaining, and context management.

## 🚀 Features

- **Multi-Agent Orchestration**: Watch distinct AI personas (CEO, Developer, Designer) communicate and pass context to solve complex problems.
- **Dynamic Prompt Chaining**: Agents use structured prompts to analyze, plan, and execute tasks collaboratively.
- **Real-time Interaction**: Users can provide a high-level goal and observe the agents debate, align, and generate a final solution.
- **Modern Tech Stack**: Built with Next.js App Router, React 18, and Tailwind CSS for a seamless, responsive UI.

## 🧠 Architecture & Agents

The simulator defines specific roles, each constrained by a unique system prompt to act within their domain:

1. **CEO (Strategic Planner)**: Breaks down the user's overarching goal into actionable requirements.
2. **Developer (Technical Lead)**: Analyzes requirements and proposes technical architecture and code implementation.
3. **Designer (UX/UI Lead)**: Focuses on user experience, interface design, and aesthetic consistency.

The system orchestrates a workflow where the CEO's output feeds into the Developer and Designer, demonstrating practical **RAG-style context window management** without losing focus.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- API keys for your preferred LLM provider (e.g., OpenAI, Google Gemini)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sagar25446-prog/AI-AGENTS-.git
cd AI-AGENTS-
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file and add your API keys:
```env
NEXT_PUBLIC_LLM_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: React
- **Styling**: Tailwind CSS
- **AI Integration**: Direct REST API calls with structured prompt engineering

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sagar25446-prog/AI-AGENTS-/issues).

## 📄 License

This project is licensed under the MIT License.
