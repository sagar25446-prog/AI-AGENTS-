'use client';

import { motion } from 'framer-motion';
import { AgentProfile, AgentRuntimeState } from '@/lib/agents/types';

interface AgentCardProps {
  profile: AgentProfile;
  state: AgentRuntimeState;
}

const STATUS_CONFIG = {
  idle: { label: 'Idle', color: '#4a5568', dot: 'bg-gray-500' },
  working: { label: 'Working', color: '#00d4ff', dot: 'bg-cyan-400' },
  debating: { label: 'Debating', color: '#ff6b6b', dot: 'bg-red-400' },
  waiting: { label: 'Waiting', color: '#f59e0b', dot: 'bg-amber-400' },
  done: { label: 'Done', color: '#10b981', dot: 'bg-emerald-400' },
};

const MOOD_EMOJIS: Record<string, string> = {
  focused: '🎯',
  excited: '🔥',
  frustrated: '😤',
  debating: '⚔️',
  satisfied: '😊',
  thinking: '🤔',
};

export default function AgentCard({ profile, state }: AgentCardProps) {
  const statusCfg = STATUS_CONFIG[state.status];
  const isActive = state.status === 'working' || state.status === 'debating';

  return (
    <motion.div
      layout
      className={`rounded-xl p-3 transition-all cursor-default ${
        isActive ? 'glass' : 'bg-white/[0.02] hover:bg-white/[0.04]'
      }`}
      style={
        isActive
          ? {
              border: `1px solid ${profile.color}25`,
              boxShadow: `0 0 20px ${profile.color}10`,
            }
          : { border: '1px solid transparent' }
      }
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 relative"
          style={{ background: `${profile.color}12` }}
        >
          {profile.avatar}
          {isActive && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-lg"
              style={{ border: `2px solid ${profile.color}40` }}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white truncate">{profile.name}</span>
            <span className="text-sm">{MOOD_EMOJIS[state.mood] || '🤔'}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${
                isActive ? 'animate-pulse' : ''
              }`}
            />
            <span className="text-[10px]" style={{ color: statusCfg.color }}>
              {statusCfg.label}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold" style={{ color: profile.color }}>
            {state.contributionScore}
          </p>
          <p className="text-[9px] text-[#4a5568]">pts</p>
        </div>
      </div>

      {/* Mini Stats Bar (shown when active or done) */}
      {(isActive || state.status === 'done') && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <div className="flex justify-between text-[10px] text-[#4a5568]">
            <span>⚔️ Won: {state.debatesWon}</span>
            <span>📦 Outputs: {state.outputCount}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
