'use client';

import { motion } from 'framer-motion';
import { AGENT_PROFILES } from '@/lib/agents/agent-profiles';

export default function AgentShowcase() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 agent-grid">
        {AGENT_PROFILES.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
          >
            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${agent.color}15, transparent 70%)`,
              }}
            />

            {/* Top border accent */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: agent.color }}
            />

            <div className="relative z-10">
              {/* Avatar & Name */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${agent.color}15` }}
                >
                  {agent.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{agent.name}</h3>
                  <p
                    className="text-xs font-medium"
                    style={{ color: agent.color }}
                  >
                    {agent.title}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#8892b0] mb-3 line-clamp-2">
                {agent.description}
              </p>

              {/* Personality Traits */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {agent.personality.map((trait) => (
                  <span
                    key={trait}
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${agent.color}15`,
                      color: agent.color,
                      border: `1px solid ${agent.color}30`,
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Debate Style */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#4a5568] uppercase tracking-wider">
                  Debate Style
                </span>
                <span className="text-[11px] text-[#8892b0] font-medium capitalize">
                  {agent.debateStyle}
                </span>
              </div>

              {/* Catchphrase (shown on hover) */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileHover={{ height: 'auto', opacity: 1 }}
                className="overflow-hidden"
              >
                <p
                  className="text-xs italic mt-3 pt-3 border-t"
                  style={{
                    color: agent.color,
                    borderColor: `${agent.color}20`,
                  }}
                >
                  &ldquo;{agent.catchphrases[0]}&rdquo;
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
