// ============================================================
// Code Generator — Produces complete application source code
// ============================================================

import { GeneratedFile } from './types';

export function generateProjectFiles(idea: string, projectType: string): GeneratedFile[] {
  switch (projectType) {
    case 'game':
      return generateGameProject(idea);
    case 'productivity':
      return generateProductivityProject(idea);
    default:
      return generateWebAppProject(idea);
  }
}

function generateGameProject(idea: string): GeneratedFile[] {
  const isMultiplayer = idea.toLowerCase().includes('multiplayer');
  const gameName = idea.toLowerCase().includes('tic-tac-toe') ? 'Tic-Tac-Toe' : 'Game';

  return [
    {
      path: 'package.json',
      language: 'json',
      size: 450,
      content: `{
  "name": "${gameName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "socket.io-client": "^4.7.0"
  }
}`,
    },
    {
      path: 'src/app/page.tsx',
      language: 'tsx',
      size: 2100,
      content: `'use client';
import { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';

export default function Home() {
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameKey, setGameKey] = useState(0);

  const handleGameEnd = (winner: string | null) => {
    if (winner) {
      setScores(prev => ({ ...prev, [winner]: prev[winner as keyof typeof prev] + 1 }));
    } else {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
        ${gameName}
      </h1>
      <p className="text-purple-300 mb-8">AI Company Simulator Generated App</p>
      <ScoreBoard scores={scores} />
      <GameBoard key={gameKey} onGameEnd={handleGameEnd} />
      <button
        onClick={() => setGameKey(k => k + 1)}
        className="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all hover:scale-105"
      >
        New Game
      </button>
    </main>
  );
}`,
    },
    {
      path: 'src/components/GameBoard.tsx',
      language: 'tsx',
      size: 3200,
      content: `'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Player = 'X' | 'O' | null;
type Board = Player[];

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

interface Props { onGameEnd: (winner: string | null) => void; }

export default function GameBoard({ onGameEnd }: Props) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  const checkWinner = useCallback((newBoard: Board): string | null => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setWinningLine(combo);
        return newBoard[a];
      }
    }
    return newBoard.every(cell => cell !== null) ? 'draw' : null;
  }, []);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      onGameEnd(result === 'draw' ? null : result);
    } else {
      setCurrentPlayer(prev => prev === 'X' ? 'O' : 'X');
    }
  };

  return (
    <div className="relative">
      {winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 rounded-2xl backdrop-blur-sm"
        >
          <p className="text-4xl font-bold text-white">
            {winner === 'draw' ? "It's a Draw!" : \`\${winner} Wins! 🎉\`}
          </p>
        </motion.div>
      )}
      <div className="grid grid-cols-3 gap-3 p-4 bg-white/5 rounded-2xl backdrop-blur-lg border border-white/10">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            whileHover={!cell && !winner ? { scale: 1.05 } : {}}
            whileTap={!cell && !winner ? { scale: 0.95 } : {}}
            onClick={() => handleClick(i)}
            className={\`w-24 h-24 rounded-xl text-4xl font-bold flex items-center justify-center transition-all \${
              winningLine.includes(i) ? 'bg-green-500/30 border-green-400' :
              cell ? 'bg-white/10 border-white/20' :
              'bg-white/5 hover:bg-white/15 border-white/10'
            } border-2\`}
          >
            <AnimatePresence>
              {cell && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={cell === 'X' ? 'text-cyan-400' : 'text-pink-400'}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      {!winner && (
        <p className="text-center mt-4 text-lg text-white/70">
          Current Player: <span className={currentPlayer === 'X' ? 'text-cyan-400' : 'text-pink-400'}>{currentPlayer}</span>
        </p>
      )}
    </div>
  );
}`,
    },
    {
      path: 'src/components/ScoreBoard.tsx',
      language: 'tsx',
      size: 800,
      content: `interface Props {
  scores: { X: number; O: number; draws: number };
}

export default function ScoreBoard({ scores }: Props) {
  return (
    <div className="flex gap-8 mb-8">
      <div className="text-center px-6 py-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
        <p className="text-cyan-400 text-2xl font-bold">{scores.X}</p>
        <p className="text-cyan-300/70 text-sm">Player X</p>
      </div>
      <div className="text-center px-6 py-3 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white text-2xl font-bold">{scores.draws}</p>
        <p className="text-white/50 text-sm">Draws</p>
      </div>
      <div className="text-center px-6 py-3 bg-pink-500/10 rounded-xl border border-pink-500/30">
        <p className="text-pink-400 text-2xl font-bold">{scores.O}</p>
        <p className="text-pink-300/70 text-sm">Player O</p>
      </div>
    </div>
  );
}`,
    },
    {
      path: 'src/app/globals.css',
      language: 'css',
      size: 300,
      content: `@import 'tailwindcss';
      
:root {
  --background: #0f172a;
  --foreground: #f8fafc;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Inter', sans-serif;
}`,
    },
    {
      path: 'src/app/layout.tsx',
      language: 'tsx',
      size: 400,
      content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${gameName} - AI Generated',
  description: 'Built by AI Company Simulator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    },
    {
      path: 'Dockerfile',
      language: 'dockerfile',
      size: 400,
      content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      size: 600,
      content: `# ${gameName}\n\n> Built autonomously by AI Company Simulator 🤖\n\n## Features\n- ${isMultiplayer ? 'Multiplayer' : 'Single-player'} gameplay\n- Beautiful animated UI\n- Score tracking\n- Responsive design\n\n## Tech Stack\n- Next.js 14\n- React 18\n- Framer Motion\n- TailwindCSS\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nOpen [http://localhost:3000](http://localhost:3000)\n\n## Deployment\n\`\`\`bash\ndocker build -t ${gameName.toLowerCase().replace(/\s+/g, '-')} .\ndocker run -p 3000:3000 ${gameName.toLowerCase().replace(/\s+/g, '-')}\n\`\`\``,
    },
  ];
}

function generateProductivityProject(idea: string): GeneratedFile[] {
  return [
    {
      path: 'package.json',
      language: 'json',
      size: 350,
      content: `{
  "name": "habit-tracker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "recharts": "^2.8.0"
  }
}`,
    },
    {
      path: 'src/app/page.tsx',
      language: 'tsx',
      size: 1800,
      content: `'use client';
import { useState } from 'react';

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  history: boolean[];
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: '🏃 Exercise', streak: 5, completedToday: false, history: [true,true,false,true,true,true,true] },
    { id: '2', name: '📚 Read', streak: 12, completedToday: true, history: [true,true,true,true,true,true,true] },
    { id: '3', name: '🧘 Meditate', streak: 3, completedToday: false, history: [false,true,false,true,true,true,false] },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, completedToday: !h.completedToday, streak: !h.completedToday ? h.streak + 1 : h.streak - 1 } : h
    ));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Habit Tracker</h1>
        <p className="text-indigo-300 mb-8">AI-Generated Productivity App</p>
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={\`p-6 rounded-2xl border cursor-pointer transition-all \${
                habit.completedToday
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }\`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-white font-semibold">{habit.name}</h3>
                  <p className="text-white/50">🔥 {habit.streak} day streak</p>
                </div>
                <div className={\`w-8 h-8 rounded-full border-2 flex items-center justify-center \${
                  habit.completedToday ? 'bg-green-500 border-green-400' : 'border-white/30'
                }\`}>
                  {habit.completedToday && '✓'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      size: 300,
      content: `# Habit Tracker\n\n> Built autonomously by AI Company Simulator 🤖\n\n## Features\n- Track daily habits\n- Streak tracking\n- Beautiful dark UI\n- Responsive design\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
    },
  ];
}

function generateWebAppProject(idea: string): GeneratedFile[] {
  return [
    {
      path: 'package.json',
      language: 'json',
      size: 300,
      content: `{
  "name": "web-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
    },
    {
      path: 'src/app/page.tsx',
      language: 'tsx',
      size: 500,
      content: `export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Welcome</h1>
        <p className="text-slate-300">Built by AI Company Simulator</p>
      </div>
    </main>
  );
}`,
    },
    {
      path: 'README.md',
      language: 'markdown',
      size: 200,
      content: `# Web App\n\n> Built autonomously by AI Company Simulator 🤖\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
    },
  ];
}
