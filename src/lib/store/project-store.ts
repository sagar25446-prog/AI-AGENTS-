// ============================================================
// Zustand Store — Global project state management
// ============================================================

import { create } from 'zustand';
import {
  ProjectState,
  PipelineStage,
  Debate,
  DebateMessage,
} from '../agents/types';
import {
  initializeProject,
  processStage,
  getStageProgress,
} from '../agents/pipeline-engine';

interface ProjectStore {
  // State
  project: ProjectState | null;
  isRunning: boolean;
  currentDebateIndex: number;
  visibleMessages: DebateMessage[];
  overallProgress: number;
  activeView: 'arena' | 'pipeline' | 'code' | 'preview';
  generatedAppHtml: string | null;
  isGeneratingPreview: boolean;
  customDebatesLoaded: boolean;

  // Actions
  startProject: (idea: string) => void;
  advanceStage: () => void;
  runFullPipeline: () => void;
  setActiveView: (view: 'arena' | 'pipeline' | 'code' | 'preview') => void;
  addVisibleMessage: (msg: DebateMessage) => void;
  clearVisibleMessages: () => void;
  generateLivePreview: () => Promise<void>;
  fetchCustomDebates: () => Promise<void>;
  reset: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: null,
  isRunning: false,
  currentDebateIndex: 0,
  visibleMessages: [],
  overallProgress: 0,
  activeView: 'arena',
  generatedAppHtml: null,
  isGeneratingPreview: false,
  customDebatesLoaded: false,

  startProject: (idea: string) => {
    const project = initializeProject(idea);
    // Mark first stage as active
    project.stages[0].status = 'active';
    project.agents = project.agents.map((a) =>
      project.stages[0].agentIds.includes(a.agentId)
        ? { ...a, status: 'working' as const, mood: 'focused' as const }
        : a
    );
    set({
      project,
      isRunning: true,
      visibleMessages: [],
      currentDebateIndex: 0,
      generatedAppHtml: null,
      customDebatesLoaded: false,
    });
    // Fire both API calls in parallel
    get().fetchCustomDebates();
    get().generateLivePreview();
  },

  advanceStage: () => {
    const { project } = get();
    if (!project) return;

    const currentStageIndex = project.stages.findIndex(
      (s) => s.id === project.currentStage
    );
    if (currentStageIndex === -1) return;

    const updatedProject = processStage(project, project.currentStage);
    const progress = getStageProgress(updatedProject);

    set({
      project: updatedProject,
      overallProgress: progress,
      isRunning: !updatedProject.isComplete,
    });
  },

  runFullPipeline: () => {
    const { project } = get();
    if (!project) return;

    let currentProject = { ...project };
    const stageIds = currentProject.stages.map((s) => s.id) as PipelineStage[];

    for (const stageId of stageIds) {
      if (stageId === 'complete') continue;
      currentProject = processStage(currentProject, stageId);
    }

    set({
      project: currentProject,
      overallProgress: 100,
      isRunning: false,
    });
  },

  setActiveView: (view) => set({ activeView: view }),

  addVisibleMessage: (msg) =>
    set((state) => ({
      visibleMessages: [...state.visibleMessages, msg],
    })),

  clearVisibleMessages: () => set({ visibleMessages: [] }),

  generateLivePreview: async () => {
    const { project, isGeneratingPreview } = get();
    if (!project || isGeneratingPreview) return;

    set({ isGeneratingPreview: true });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: project.idea,
          projectType: project.projectType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate preview');
      }

      const data = await response.json();
      if (data.html) {
        set({ generatedAppHtml: data.html, isGeneratingPreview: false });
      } else {
        throw new Error('No HTML in response');
      }
    } catch (error) {
      console.error('Error generating live preview:', error);
      set({ isGeneratingPreview: false });
    }
  },

  fetchCustomDebates: async () => {
    const { project } = get();
    if (!project) return;

    try {
      console.log('[store] Fetching custom debates for:', project.idea);
      const response = await fetch('/api/debates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: project.idea, projectType: project.projectType }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('[store] Debates API error:', errData);
        return;
      }

      const customDebates = await response.json();
      
      // Check if we got an error response
      if (customDebates.error) {
        console.error('[store] Debates API returned error:', customDebates.error);
        return;
      }

      const stageKeys = Object.keys(customDebates).filter(
        k => k !== 'error' && Array.isArray(customDebates[k])
      );
      console.log('[store] Got custom debates for stages:', stageKeys);

      if (stageKeys.length === 0) {
        console.warn('[store] No valid debate stages in response');
        return;
      }

      // Inject the LLM-generated debates into the project stages
      set((state) => {
        if (!state.project) return state;

        const updatedStages = state.project.stages.map(stage => {
          const stageDebates = customDebates[stage.id];
          if (stageDebates && Array.isArray(stageDebates) && stageDebates.length > 0) {
            const debatesWithTimestamps = stageDebates.map((d: any, dIdx: number) => ({
              id: d.id || `debate-${stage.id}-${dIdx}`,
              topic: d.topic || 'Agent Discussion',
              participants: d.participants || d.messages?.map((m: any) => m.agentId).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i) || [],
              status: d.status || 'resolved',
              intensity: d.intensity || 7,
              startTime: Date.now(),
              messages: (d.messages || []).map((m: any, idx: number) => ({
                id: m.id || `msg-${stage.id}-${dIdx}-${idx}`,
                agentId: m.agentId,
                content: m.content,
                type: m.type || 'proposal',
                intensity: m.intensity || 5,
                timestamp: Date.now() + idx * 1000,
              })),
            }));
            return { ...stage, debates: debatesWithTimestamps };
          }
          return stage;
        });

        return {
          project: { ...state.project, stages: updatedStages },
          customDebatesLoaded: true,
        };
      });

      console.log('[store] Custom debates injected successfully');
    } catch (error) {
      console.error('[store] Failed to fetch custom debates:', error);
      // Static fallback debates remain in place
    }
  },

  reset: () =>
    set({
      project: null,
      isRunning: false,
      currentDebateIndex: 0,
      visibleMessages: [],
      overallProgress: 0,
      activeView: 'arena',
      generatedAppHtml: null,
      customDebatesLoaded: false,
    }),
}));

export default useProjectStore;
