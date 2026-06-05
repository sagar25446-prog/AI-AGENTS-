'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '@/lib/store/project-store';
import { useRouter } from 'next/navigation';
import AgentArena from '@/components/dashboard/AgentArena';
import PipelineView from '@/components/dashboard/PipelineView';
import AgentCard from '@/components/dashboard/AgentCard';
import CodeViewer from '@/components/dashboard/CodeViewer';
import ProgressStats from '@/components/dashboard/ProgressStats';
import { getAgentById } from '@/lib/agents/agent-profiles';
import { DebateMessage } from '@/lib/agents/types';
import { getPreviewHtml } from '@/lib/agents/preview-generator';
import {
  Swords,
  GitBranch,
  Code2,
  Play,
  RotateCcw,
  Zap,
  Users,
  ArrowLeft,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const {
    project,
    isRunning,
    activeView,
    overallProgress,
    visibleMessages,
    generatedAppHtml,
    isGeneratingPreview,
    customDebatesLoaded,
    startProject,
    advanceStage,
    setActiveView,
    addVisibleMessage,
    clearVisibleMessages,
    reset,
  } = useProjectStore();


  const [currentStageDebateMessages, setCurrentStageDebateMessages] = useState<DebateMessage[]>([]);
  const messageIndexRef = useRef(0);

  // Initialize project from sessionStorage
  useEffect(() => {
    if (!project) {
      const idea = typeof window !== 'undefined' ? sessionStorage.getItem('projectIdea') : null;
      if (idea) {
        startProject(idea);
      } else {
        router.push('/');
      }
    }
  }, [project, startProject, router]);


  // Collect all debate messages for the current stage
  useEffect(() => {
    if (!project) return;
    const currentStage = project.stages.find(s => s.id === project.currentStage);
    if (currentStage && currentStage.debates.length > 0) {
      const msgs = currentStage.debates.flatMap(d => d.messages);
      clearVisibleMessages();
      setCurrentStageDebateMessages(msgs);
      messageIndexRef.current = 0;
    } else {
      clearVisibleMessages();
      setCurrentStageDebateMessages([]);
      messageIndexRef.current = 0;
    }
  }, [project?.currentStage, project?.stages, project, clearVisibleMessages]);

  // Drip-feed debate messages for dramatic effect
  const feedMessages = useCallback(() => {
    if (messageIndexRef.current < currentStageDebateMessages.length) {
      addVisibleMessage(currentStageDebateMessages[messageIndexRef.current]);
      messageIndexRef.current++;
    }
  }, [currentStageDebateMessages, addVisibleMessage]);

  // Auto-advance pipeline stages
  useEffect(() => {
    if (!project || !isRunning) return;

    // First advance the stage to generate debates
    const stageInterval = setInterval(() => {
      advanceStage();
    }, 8000); // Each stage takes 8 seconds (gives LLM time to respond)



    return () => clearInterval(stageInterval);
  }, [project, isRunning, advanceStage]);

  // Feed messages at intervals
  useEffect(() => {
    if (!isRunning || currentStageDebateMessages.length === 0) return;

    const msgInterval = setInterval(() => {
      feedMessages();
    }, 800); // New message every 800ms



    return () => clearInterval(msgInterval);
  }, [isRunning, currentStageDebateMessages, feedMessages]);



  const handleReset = () => {
    reset();
    router.push('/');
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#06060f' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#00d4ff]/30 border-t-[#00d4ff] rounded-full"
        />
      </div>
    );
  }

  const currentStage = project.stages.find(s => s.id === project.currentStage);
  const activeStageIndex = project.stages.findIndex(s => s.id === project.currentStage);
  const allDebates = project.stages
    .filter((s, i) => i <= activeStageIndex || s.status === 'complete')
    .flatMap(s => s.debates);

  const viewTabs = [
    { id: 'arena' as const, label: 'Agent Arena', icon: Swords },
    { id: 'pipeline' as const, label: 'Pipeline', icon: GitBranch },
    { id: 'code' as const, label: 'Source Code', icon: Code2 },
    { id: 'preview' as const, label: 'Live Preview', icon: Play },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#06060f' }}>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[#8892b0] hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={20} className="text-[#00d4ff]" />
                {project.projectName}
              </h1>
              <p className="text-xs text-[#8892b0] truncate max-w-[300px]">
                {project.idea}
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-[#8892b0]">Progress</span>
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full progress-glow"
                  style={{
                    background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-semibold text-[#00d4ff]">
                {overallProgress}%
              </span>
            </div>

            {/* Status Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                project.isComplete
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isRunning
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  project.isComplete
                    ? 'bg-emerald-400'
                    : isRunning
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-amber-400'
                }`}
              />
              {project.isComplete
                ? 'Complete'
                : isRunning
                ? 'Building...'
                : 'Ready'}
            </div>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[#8892b0] hover:text-white"
              title="Start Over"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* View Tabs */}
      <div className="border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-4">
          <div className="flex gap-1">
            {viewTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                  activeView === tab.id
                    ? 'text-[#00d4ff]'
                    : 'text-[#8892b0] hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeView === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 dashboard-grid">
          {/* Left Sidebar — Agent Status */}
          <div className="lg:col-span-1 space-y-3">
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users size={14} />
                Agent Status
              </h3>
              <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {project.agents.map((agentState) => {
                  const profile = getAgentById(agentState.agentId);
                  if (!profile) return null;
                  return (
                    <AgentCard
                      key={agentState.agentId}
                      profile={profile}
                      state={agentState}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeView === 'arena' && (
                <motion.div
                  key="arena"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Current Stage Info */}
                  {currentStage && (
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {currentStage.name}
                          </h3>
                          <p className="text-sm text-[#8892b0]">
                            {currentStage.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {currentStage.agentIds.map((id) => {
                            const agent = getAgentById(id);
                            return agent ? (
                              <span
                                key={id}
                                className="text-2xl"
                                title={agent.name}
                              >
                                {agent.avatar}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  <AgentArena debates={allDebates} visibleMessages={visibleMessages} />
                  <ProgressStats project={project} />
                </motion.div>
              )}

              {activeView === 'pipeline' && (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <PipelineView
                    stages={project.stages}
                    currentStage={project.currentStage}
                  />
                </motion.div>
              )}

              {activeView === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CodeViewer files={project.generatedFiles} />
                </motion.div>
              )}

              {activeView === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass rounded-xl p-6"
                >
                  {generatedAppHtml ? (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Play size={20} className="text-emerald-400" />
                        Live Preview — Your Generated App
                      </h3>
                      <div className="bg-white rounded-xl overflow-hidden" style={{ height: '600px' }}>
                        <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                          </div>
                          <div className="flex-1 bg-white rounded px-3 py-0.5 text-sm text-gray-500 text-center">
                            {project.projectName}.app
                          </div>
                        </div>
                        <div className="bg-white p-0 h-full w-full">
                          <iframe
                            srcDoc={generatedAppHtml}
                            className="w-full h-full border-0"
                            title="Live Preview"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </div>
                      </div>
                    </div>
                  ) : isGeneratingPreview ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="text-6xl mb-6"
                      >
                        🤖
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        AI is Generating Your App...
                      </h3>
                      <p className="text-[#8892b0] text-center max-w-md">
                        The Gemini AI is writing the complete source code for your application.
                        This usually takes 15-30 seconds.
                      </p>
                      <motion.div
                        className="mt-6 h-1 bg-white/10 rounded-full w-64 overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                          style={{ width: '50%' }}
                        />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        className="text-6xl mb-6"
                      >
                        ⚙️
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Waiting for AI Agents...
                      </h3>
                      <p className="text-[#8892b0] text-center max-w-md">
                        The AI agents are discussing and debating your project. The live
                        preview will appear here when the AI finishes generating the code.
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-[#00d4ff]">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 bg-[#00d4ff] rounded-full"
                        />
                        Stage {project.stages.findIndex(s => s.id === project.currentStage) + 1} of{' '}
                        {project.stages.length}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
