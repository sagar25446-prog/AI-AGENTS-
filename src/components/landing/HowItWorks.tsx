'use client';

import { motion } from 'framer-motion';
import { PIPELINE_STAGES } from '@/lib/agents/pipeline-engine';
import { getAgentById } from '@/lib/agents/agent-profiles';
import { CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00d4ff]/50 via-[#a855f7]/50 to-[#22c55e]/50 md:-translate-x-px" />

        {PIPELINE_STAGES.map((stage, index) => {
          const isLeft = index % 2 === 0;
          const agents = stage.agentIds.map(id => getAgentById(id)).filter(Boolean);
          const primaryAgent = agents[0];

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              viewport={{ once: true, margin: '-50px' }}
              className={`relative flex items-center mb-6 ${
                isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-row`}
            >
              {/* Content Card */}
              <div className={`flex-1 ${isLeft ? 'md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
                <div
                  className={`glass rounded-xl p-4 ${
                    isLeft ? 'md:text-right' : 'md:text-left'
                  } text-left`}
                >
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      isLeft ? 'md:justify-end' : 'md:justify-start'
                    } justify-start`}
                  >
                    {primaryAgent && (
                      <span className="text-lg">{primaryAgent.avatar}</span>
                    )}
                    <h4 className="font-bold text-white text-sm">
                      {stage.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[#8892b0]">{stage.description}</p>
                  {agents.length > 0 && (
                    <div
                      className={`flex gap-1 mt-2 ${
                        isLeft ? 'md:justify-end' : 'md:justify-start'
                      } justify-start`}
                    >
                      {agents.map((a) =>
                        a ? (
                          <span
                            key={a.id}
                            className="text-[10px] px-1.5 py-0.5 rounded-full"
                            style={{
                              background: `${a.color}15`,
                              color: a.color,
                            }}
                          >
                            {a.name}
                          </span>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Center Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  whileInView={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  viewport={{ once: true }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: primaryAgent
                      ? `${primaryAgent.color}30`
                      : 'rgba(255,255,255,0.1)',
                    border: `2px solid ${
                      primaryAgent ? primaryAgent.color : '#ffffff30'
                    }`,
                    color: primaryAgent ? primaryAgent.color : '#fff',
                  }}
                >
                  {index + 1}
                </motion.div>
              </div>

              {/* Spacer for opposite side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          );
        })}

        {/* Final checkmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="absolute left-8 md:left-1/2 -translate-x-1/2 -bottom-4"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
