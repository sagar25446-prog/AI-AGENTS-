'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectState } from '@/lib/agents/types';
import { getAgentById } from '@/lib/agents/agent-profiles';
import {
  FileCode2,
  Bug,
  Swords,
  Lightbulb,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface ProgressStatsProps {
  project: ProjectState;
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{count}</span>;
}

export default function ProgressStats({ project }: ProgressStatsProps) {
  const completedStages = project.stages.filter(s => s.status === 'complete').length;
  const totalStages = project.stages.length;
  const progressPercent = Math.round((completedStages / totalStages) * 100);
  const elapsed = Math.round((Date.now() - project.startTime) / 1000);

  const stats = [
    {
      label: 'Files Generated',
      value: project.generatedFiles.length,
      icon: FileCode2,
      color: '#00d4ff',
    },
    {
      label: 'Debates Held',
      value: project.totalDebates,
      icon: Swords,
      color: '#ff6b6b',
    },
    {
      label: 'Decisions Made',
      value: project.totalDecisions,
      icon: Lightbulb,
      color: '#fbbf24',
    },
    {
      label: 'Stages Complete',
      value: completedStages,
      icon: TrendingUp,
      color: '#10b981',
    },
  ];

  // Get top contributors
  const topAgents = [...project.agents]
    .sort((a, b) => b.contributionScore - a.contributionScore)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Progress Ring + Stats */}
      <div className="glass rounded-xl p-5">
        <h4 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp size={14} />
          Build Progress
        </h4>

        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 42 * (1 - progressPercent / 100),
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{progressPercent}%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <stat.icon size={12} style={{ color: stat.color }} />
                  <span className="text-lg font-bold text-white">
                    <AnimatedCounter target={stat.value} />
                  </span>
                </div>
                <p className="text-[10px] text-[#4a5568]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Elapsed */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#4a5568]">
            <Clock size={12} />
            Time Elapsed
          </div>
          <span className="text-xs font-mono text-[#8892b0]">
            {Math.floor(elapsed / 60)}m {elapsed % 60}s
          </span>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="glass rounded-xl p-5">
        <h4 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-4">
          🏆 Top Contributors
        </h4>
        <div className="space-y-3">
          {topAgents.map((agentState, index) => {
            const profile = getAgentById(agentState.agentId);
            if (!profile) return null;

            const maxScore = topAgents[0]?.contributionScore || 1;
            const barWidth = (agentState.contributionScore / maxScore) * 100;

            return (
              <div key={agentState.agentId} className="flex items-center gap-3">
                <span className="text-sm w-5 text-right font-bold" style={{ color: index === 0 ? '#fbbf24' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#4a5568' }}>
                  #{index + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${profile.color}15` }}
                >
                  {profile.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-white truncate">{profile.name}</span>
                    <span className="text-xs font-bold" style={{ color: profile.color }}>
                      {agentState.contributionScore}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: profile.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
