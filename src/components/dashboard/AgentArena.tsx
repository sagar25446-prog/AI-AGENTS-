'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Debate, DebateMessage } from '@/lib/agents/types';
import { getAgentById } from '@/lib/agents/agent-profiles';
import { Flame, CheckCircle2, Swords, MessageSquare } from 'lucide-react';

interface AgentArenaProps {
  debates: Debate[];
  visibleMessages: DebateMessage[];
}

const TYPE_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  proposal: { label: '💡 Proposal', color: '#00d4ff', bg: '#00d4ff15' },
  challenge: { label: '⚔️ Challenge', color: '#ff6b6b', bg: '#ff6b6b15' },
  'counter-argument': { label: '🔄 Counter', color: '#f97316', bg: '#f9731615' },
  agreement: { label: '✅ Agree', color: '#10b981', bg: '#10b98115' },
  compromise: { label: '🤝 Compromise', color: '#a855f7', bg: '#a855f715' },
  decision: { label: '⚡ Decision', color: '#fbbf24', bg: '#fbbf2415' },
  announcement: { label: '📢 Alert', color: '#ef4444', bg: '#ef444415' },
  output: { label: '📦 Output', color: '#22c55e', bg: '#22c55e15' },
};

export default function AgentArena({ debates, visibleMessages }: AgentArenaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  // Calculate overall intensity
  const avgIntensity = debates.length > 0
    ? Math.round(debates.reduce((sum, d) => sum + d.intensity, 0) / debates.length)
    : 0;

  const resolvedDebates = debates.filter(d => d.status === 'resolved').length;

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Arena Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Swords size={20} className="text-[#ff6b6b]" />
          <div>
            <h3 className="font-bold text-white text-sm">Agent Arena</h3>
            <p className="text-xs text-[#4a5568]">Real-time agent debates & decisions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Debates counter */}
          <div className="flex items-center gap-1.5 text-xs">
            <MessageSquare size={12} className="text-[#8892b0]" />
            <span className="text-[#8892b0]">{debates.length} debates</span>
          </div>
          {/* Resolved counter */}
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 size={12} className="text-emerald-400" />
            <span className="text-emerald-400">{resolvedDebates} resolved</span>
          </div>
          {/* Intensity meter */}
          <div className="flex items-center gap-2">
            <Flame size={14} className={avgIntensity > 6 ? 'text-[#ff6b6b]' : 'text-[#8892b0]'} />
            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: avgIntensity > 7
                    ? 'linear-gradient(90deg, #f97316, #ef4444)'
                    : avgIntensity > 4
                    ? 'linear-gradient(90deg, #fbbf24, #f97316)'
                    : 'linear-gradient(90deg, #22c55e, #fbbf24)',
                }}
                animate={{ width: `${avgIntensity * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Debate Topics */}
      {debates.length > 0 && (
        <div className="px-5 py-2 border-b border-white/5 flex gap-2 overflow-x-auto">
          {debates.map((debate) => (
            <div
              key={debate.id}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                debate.status === 'resolved'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : debate.intensity > 7
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-white/5 text-[#8892b0] border border-white/10'
              }`}
            >
              {debate.intensity > 7 && <Flame size={10} />}
              {debate.status === 'resolved' && <CheckCircle2 size={10} />}
              <span className="truncate max-w-[200px]">{debate.topic}</span>
              <div className="flex -space-x-1">
                {debate.participants.slice(0, 3).map(pId => {
                  const agent = getAgentById(pId);
                  return agent ? (
                    <span key={pId} className="text-xs" title={agent.name}>{agent.avatar}</span>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="p-4 space-y-3 max-h-[500px] overflow-y-auto"
        style={{ minHeight: '300px' }}
      >
        {visibleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl mb-4"
            >
              ⚔️
            </motion.div>
            <p className="text-[#8892b0] font-medium">Waiting for agents to start debating...</p>
            <p className="text-xs text-[#4a5568] mt-1">Watch them fight for the best approach</p>
          </div>
        ) : (
          <AnimatePresence>
            {visibleMessages.map((msg, index) => {
              const agent = getAgentById(msg.agentId);
              if (!agent) return null;

              const badge = TYPE_BADGES[msg.type] || TYPE_BADGES.output;
              const isChallenge = msg.type === 'challenge' || msg.type === 'counter-argument' || msg.type === 'announcement';
              const isFromLeft = index % 2 === 0;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: isFromLeft ? -20 : 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${isFromLeft ? '' : 'flex-row-reverse'}`}
                >
                  {/* Agent Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl relative"
                      style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
                    >
                      {agent.avatar}
                      {msg.intensity > 7 && (
                        <motion.div
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                          className="absolute -top-1 -right-1 text-xs"
                        >
                          🔥
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[80%] ${isFromLeft ? '' : 'flex flex-col items-end'}`}>
                    {/* Agent name & badge */}
                    <div className={`flex items-center gap-2 mb-1 ${isFromLeft ? '' : 'flex-row-reverse'}`}>
                      <span className="text-xs font-semibold" style={{ color: agent.color }}>
                        {agent.name}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                      {msg.intensity > 7 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#ff6b6b15] text-[#ff6b6b] font-bold animate-pulse">
                          🔥 HEATED
                        </span>
                      )}
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        isChallenge
                          ? 'border-l-2'
                          : 'border-l-2'
                      }`}
                      style={{
                        background: isChallenge
                          ? `${agent.color}08`
                          : 'rgba(255,255,255,0.03)',
                        borderLeftColor: agent.color,
                      }}
                    >
                      <p className="text-[#c8d1e0] leading-relaxed">{msg.content}</p>
                    </div>

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {msg.reactions.map((reaction, ri) => {
                          const reactAgent = getAgentById(reaction.agentId);
                          return (
                            <span
                              key={ri}
                              className="text-xs px-1.5 py-0.5 rounded-full bg-white/5"
                              title={reactAgent?.name}
                            >
                              {reaction.emoji}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
