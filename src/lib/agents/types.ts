// ============================================================
// Agent System Type Definitions
// ============================================================

export type AgentRole =
  | 'company-formation'
  | 'ceo'
  | 'project-manager'
  | 'product-manager'
  | 'ui-ux-designer'
  | 'frontend-engineer'
  | 'backend-engineer'
  | 'database-architect'
  | 'ai-engineer'
  | 'qa-engineer'
  | 'devops-engineer'
  | 'marketing-manager';

export type DebateStyle = 'confrontational' | 'collaborative' | 'analytical' | 'creative' | 'diplomatic';
export type PersonalityTrait = 'aggressive' | 'meticulous' | 'visionary' | 'pragmatic' | 'perfectionist' | 'innovative';
export type AgentMood = 'focused' | 'excited' | 'frustrated' | 'debating' | 'satisfied' | 'thinking';

export interface AgentProfile {
  id: string;
  name: string;
  role: AgentRole;
  title: string;
  avatar: string;
  color: string;
  bgGradient: string;
  personality: PersonalityTrait[];
  debateStyle: DebateStyle;
  catchphrases: string[];
  expertise: string[];
  description: string;
}

export type MessageType = 'proposal' | 'challenge' | 'counter-argument' | 'agreement' | 'compromise' | 'decision' | 'output' | 'announcement';

export interface DebateMessage {
  id: string;
  agentId: string;
  type: MessageType;
  content: string;
  timestamp: number;
  replyTo?: string;
  intensity: number; // 1-10
  reactions?: { agentId: string; emoji: string }[];
}

export interface Debate {
  id: string;
  topic: string;
  participants: string[];
  messages: DebateMessage[];
  status: 'active' | 'heated' | 'resolved' | 'consensus';
  winner?: string;
  resolution?: string;
  intensity: number;
  startTime: number;
  endTime?: number;
}

export type PipelineStage =
  | 'company-formation'
  | 'ceo-planning'
  | 'project-management'
  | 'product-requirements'
  | 'ui-ux-design'
  | 'frontend-development'
  | 'backend-development'
  | 'database-design'
  | 'ai-integration'
  | 'testing'
  | 'deployment'
  | 'marketing'
  | 'building'
  | 'complete';

export type StageStatus = 'pending' | 'active' | 'debating' | 'complete';

export interface PipelineStageInfo {
  id: PipelineStage;
  name: string;
  description: string;
  agentIds: string[];
  status: StageStatus;
  progress: number;
  outputs: StageOutput[];
  debates: Debate[];
  startTime?: number;
  endTime?: number;
}

export interface StageOutput {
  id: string;
  type: 'document' | 'code' | 'design' | 'config' | 'test' | 'strategy';
  title: string;
  content: string;
  language?: string;
  agentId: string;
  timestamp: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  size: number;
}

export interface ProjectState {
  id: string;
  idea: string;
  projectName: string;
  projectType: string;
  currentStage: PipelineStage;
  stages: PipelineStageInfo[];
  agents: AgentRuntimeState[];
  generatedFiles: GeneratedFile[];
  totalDebates: number;
  totalDecisions: number;
  startTime: number;
  endTime?: number;
  isComplete: boolean;
}

export interface AgentRuntimeState {
  agentId: string;
  status: 'idle' | 'working' | 'debating' | 'waiting' | 'done';
  mood: AgentMood;
  currentTask?: string;
  contributionScore: number;
  debatesWon: number;
  debatesLost: number;
  outputCount: number;
}
