'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AGENT_PROFILES } from '@/lib/agents/agent-profiles';
import { Sparkles, Bot, Zap } from 'lucide-react';

const EXAMPLE_PROMPTS = [
  'Build a multiplayer Tic-Tac-Toe game',
  'Create a habit tracking mobile app',
  'Design a real-time chat application',
  'Build an AI-powered todo app',
  'Create a music streaming dashboard',
];

export default function HeroSection() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const target = EXAMPLE_PROMPTS[currentPrompt];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText.length < target.length) {
      timeout = setTimeout(() => {
        setDisplayText(target.slice(0, displayText.length + 1));
      }, 50);
    } else if (!isDeleting && displayText.length === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 30);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setCurrentPrompt((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPrompt]);

  const scrollToLaunch = () => {
    document.getElementById('launch')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16">
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #00d4ff, transparent)',
            top: '10%',
            left: '10%',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #a855f7, transparent)',
            bottom: '10%',
            right: '10%',
          }}
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-full px-5 py-2 mb-8 flex items-center gap-2"
      >
        <Sparkles size={16} className="text-[#f59e0b]" />
        <span className="text-sm font-medium text-[#8892b0]">
          Powered by Multi-Agent AI Orchestration
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-center leading-tight mb-6 tracking-tight"
      >
        <span className="text-gradient-primary">AI Company</span>
        <br />
        <span className="text-white">Simulator</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-[#8892b0] text-center max-w-2xl mb-8"
      >
        Transform any idea into a production-ready application.
        <br className="hidden md:block" />
        Watch 12 AI agents{' '}
        <span className="text-[#ff6b6b] font-semibold">debate</span>,{' '}
        <span className="text-[#00d4ff] font-semibold">design</span>,{' '}
        <span className="text-[#22c55e] font-semibold">code</span>, and{' '}
        <span className="text-[#a855f7] font-semibold">deploy</span> your
        vision.
      </motion.p>

      {/* Typing Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-2xl px-6 py-4 mb-10 max-w-xl w-full"
      >
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-[#00d4ff] flex-shrink-0" />
          <div className="flex-1 font-mono text-[#8892b0]">
            <span className="text-[#00d4ff]">&gt;</span>{' '}
            <span className="text-white">{displayText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-[#00d4ff] ml-0.5"
            >
              |
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToLaunch}
        className="px-8 py-4 rounded-2xl font-bold text-lg text-white relative overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
        }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <Zap size={20} />
          Start Building
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex flex-wrap justify-center gap-8 mt-16"
      >
        {[
          { value: '12', label: 'AI Agents', color: '#00d4ff' },
          { value: '14', label: 'Pipeline Stages', color: '#a855f7' },
          { value: '47+', label: 'Debates per Build', color: '#ff6b6b' },
          { value: '100%', label: 'Autonomous', color: '#22c55e' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p
              className="text-3xl font-black"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            <p className="text-sm text-[#8892b0] mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Orbiting Agents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {AGENT_PROFILES.slice(0, 8).map((agent, i) => (
          <motion.div
            key={agent.id}
            className="absolute text-3xl"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [
                Math.cos((i / 8) * Math.PI * 2) * 320,
                Math.cos(((i + 1) / 8) * Math.PI * 2) * 320,
                Math.cos(((i + 2) / 8) * Math.PI * 2) * 320,
                Math.cos(((i + 3) / 8) * Math.PI * 2) * 320,
                Math.cos(((i + 4) / 8) * Math.PI * 2) * 320,
                Math.cos(((i + 5) / 8) * Math.PI * 2) * 320,
                Math.cos(((i + 6) / 8) * Math.PI * 2) * 320,
                Math.cos(((i + 7) / 8) * Math.PI * 2) * 320,
                Math.cos((i / 8) * Math.PI * 2) * 320,
              ],
              y: [
                Math.sin((i / 8) * Math.PI * 2) * 320,
                Math.sin(((i + 1) / 8) * Math.PI * 2) * 320,
                Math.sin(((i + 2) / 8) * Math.PI * 2) * 320,
                Math.sin(((i + 3) / 8) * Math.PI * 2) * 320,
                Math.sin(((i + 4) / 8) * Math.PI * 2) * 320,
                Math.sin(((i + 5) / 8) * Math.PI * 2) * 320,
                Math.sin(((i + 6) / 8) * Math.PI * 2) * 320,
                Math.sin(((i + 7) / 8) * Math.PI * 2) * 320,
                Math.sin((i / 8) * Math.PI * 2) * 320,
              ],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <span className="opacity-20 hover:opacity-60 transition-opacity text-4xl">
              {agent.avatar}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
