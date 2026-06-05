'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PipelineStageInfo, PipelineStage } from '@/lib/agents/types';
import { getAgentById } from '@/lib/agents/agent-profiles';
import {
  CheckCircle2,
  Circle,
  Loader2,
  ChevronDown,
  Swords,
  FileText,
} from 'lucide-react';

interface PipelineViewProps {
  stages: PipelineStageInfo[];
  currentStage: PipelineStage;
}

export default function PipelineView({ stages, currentStage }: PipelineViewProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 size={20} className="text-emerald-400" />;
      case 'active':
      case 'debating':
        return (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
            <Loader2 size={20} className="text-[#00d4ff]" />
          </motion.div>
        );
      default:
        return <Circle size={20} className="text-[#4a5568]" />;
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Pipeline Progress</h3>

      <div className="space-y-1">
        {stages.map((stage, index) => {
          const agents = stage.agentIds.map(id => getAgentById(id)).filter(Boolean);
          const isExpanded = expandedStage === stage.id;
          const isActive = stage.status === 'active' || stage.status === 'debating';
          const isComplete = stage.status === 'complete';

          return (
            <div key={stage.id}>
              {/* Stage Row */}
              <motion.button
                onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-[#00d4ff]/5 border border-[#00d4ff]/20'
                    : isComplete
                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                    : 'hover:bg-white/3'
                }`}
                animate={isActive ? { borderColor: ['rgba(0,212,255,0.2)', 'rgba(0,212,255,0.5)', 'rgba(0,212,255,0.2)'] } : {}}
                transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">{getStatusIcon(stage.status)}</div>

                {/* Stage Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white truncate">
                      {stage.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] font-medium animate-pulse">
                        IN PROGRESS
                      </span>
                    )}
                    {stage.debates.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff6b6b]/10 text-[#ff6b6b] font-medium flex items-center gap-1">
                        <Swords size={8} />
                        {stage.debates.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4a5568] truncate">{stage.description}</p>
                </div>

                {/* Agent Avatars */}
                <div className="flex -space-x-1 flex-shrink-0">
                  {agents.map(a => a ? (
                    <span
                      key={a.id}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                      style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}
                      title={a.name}
                    >
                      {a.avatar}
                    </span>
                  ) : null)}
                </div>

                {/* Expand arrow */}
                {(stage.outputs.length > 0 || stage.debates.length > 0) && (
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-[#4a5568]">
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </motion.button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (stage.outputs.length > 0 || stage.debates.length > 0) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-10 pl-4 border-l border-white/5 py-3 space-y-3">
                      {/* Outputs */}
                      {stage.outputs.map(output => (
                        <div key={output.id} className="glass-subtle rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText size={12} className="text-[#00d4ff]" />
                            <span className="text-xs font-semibold text-white">{output.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#8892b0] capitalize">
                              {output.type}
                            </span>
                          </div>
                          <pre className="text-[11px] text-[#8892b0] font-mono whitespace-pre-wrap line-clamp-6 mt-1">
                            {output.content.slice(0, 300)}{output.content.length > 300 ? '...' : ''}
                          </pre>
                        </div>
                      ))}

                      {/* Debate Summary */}
                      {stage.debates.map(debate => (
                        <div key={debate.id} className="glass-subtle rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Swords size={12} className="text-[#ff6b6b]" />
                            <span className="text-xs font-semibold text-white">{debate.topic}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                              debate.status === 'resolved'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-[#ff6b6b]/10 text-[#ff6b6b]'
                            }`}>
                              {debate.status === 'resolved' ? '✅ Resolved' : '🔥 Active'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {debate.participants.map(pId => {
                              const a = getAgentById(pId);
                              return a ? (
                                <span key={pId} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${a.color}15`, color: a.color }}>
                                  {a.avatar} {a.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Connector Line */}
              {index < stages.length - 1 && (
                <div className="ml-7 h-1 flex items-center">
                  <div
                    className={`w-0.5 h-full ${
                      isComplete ? 'bg-emerald-500/30' : 'bg-white/5'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
