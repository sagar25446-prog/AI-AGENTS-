'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';

const EXAMPLES = [
  { label: '🎮 Multiplayer Tic-Tac-Toe', value: 'Build a multiplayer Tic-Tac-Toe game with real-time gameplay' },
  { label: '✅ Habit Tracker', value: 'Create a habit tracking app with streaks and analytics' },
  { label: '📝 Todo App', value: 'Build an AI-powered todo app with smart prioritization' },
  { label: '💬 Chat App', value: 'Create a real-time chat application with rooms' },
  { label: '📊 Dashboard', value: 'Build an analytics dashboard with real-time charts' },
];

interface IdeaInputProps {
  onLaunch: (idea: string) => void;
}

export default function IdeaInput({ onLaunch }: IdeaInputProps) {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!idea.trim()) return;
    setIsLoading(true);
    onLaunch(idea.trim());
  };

  const selectExample = (value: string) => {
    setIdea(value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-strong rounded-3xl p-8"
      >
        {/* Input Area */}
        <div className="relative mb-4">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your product idea..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-[#4a5568] resize-none focus:outline-none focus:border-[#00d4ff]/50 focus:ring-2 focus:ring-[#00d4ff]/20 transition-all text-lg"
            style={{ fontFamily: 'var(--font-sans)' }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-[#4a5568]">
            {idea.length} / 500
          </div>
        </div>

        {/* Example Chips */}
        <div className="mb-6">
          <p className="text-xs text-[#4a5568] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={12} />
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example.value}
                onClick={() => selectExample(example.value)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-[#8892b0] hover:bg-white/10 hover:text-white hover:border-[#00d4ff]/30 transition-all"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!idea.trim() || isLoading}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            idea.trim()
              ? 'text-white shadow-lg shadow-[#00d4ff]/20'
              : 'bg-white/5 text-[#4a5568] cursor-not-allowed'
          }`}
          style={
            idea.trim()
              ? { background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }
              : undefined
          }
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Rocket size={22} />
              </motion.div>
              Launching AI Company...
            </>
          ) : (
            <>
              <Rocket size={22} />
              Launch AI Company 🚀
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
