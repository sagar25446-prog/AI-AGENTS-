// ============================================================
// Pipeline Engine — Orchestrates the full agent workflow
// ============================================================

import {
  PipelineStage,
  PipelineStageInfo,
  StageOutput,
  AgentRuntimeState,
  ProjectState,
  GeneratedFile,
} from './types';
import { generateDebatesForStage } from './debate-engine';
import { generateProjectFiles } from './code-generator';

export const PIPELINE_STAGES: PipelineStageInfo[] = [
  {
    id: 'company-formation',
    name: 'Company Formation',
    description: 'Establishing the virtual company, defining vision, mission, and market positioning.',
    agentIds: ['company-formation'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'ceo-planning',
    name: 'CEO Strategic Planning',
    description: 'Creating strategic roadmap, defining objectives, and coordinating departments.',
    agentIds: ['ceo'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Planning sprints, allocating resources, and creating project timeline.',
    agentIds: ['project-manager'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'product-requirements',
    name: 'Product Requirements',
    description: 'Defining features, writing user stories, and prioritizing the backlog.',
    agentIds: ['product-manager'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    description: 'Designing user experience, creating layouts, and defining the visual system.',
    agentIds: ['ui-ux-designer'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'frontend-development',
    name: 'Frontend Development',
    description: 'Building UI components, implementing client-side logic, and styling.',
    agentIds: ['frontend-engineer'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'backend-development',
    name: 'Backend Development',
    description: 'Building APIs, implementing business logic, and creating services.',
    agentIds: ['backend-engineer'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'database-design',
    name: 'Database Design',
    description: 'Designing data models, defining relationships, and optimizing storage.',
    agentIds: ['database-architect'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'ai-integration',
    name: 'AI Integration',
    description: 'Integrating AI capabilities and creating intelligent features.',
    agentIds: ['ai-engineer'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'testing',
    name: 'Quality Assurance',
    description: 'Testing application, identifying defects, and validating requirements.',
    agentIds: ['qa-engineer'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'deployment',
    name: 'Deployment & DevOps',
    description: 'Preparing deployment, configuring infrastructure, and automating CI/CD.',
    agentIds: ['devops-engineer'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'marketing',
    name: 'Marketing Strategy',
    description: 'Product positioning, launch planning, and growth strategy.',
    agentIds: ['marketing-manager'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'building',
    name: 'Application Builder',
    description: 'Assembling the final application from all agent outputs.',
    agentIds: ['frontend-engineer', 'backend-engineer', 'devops-engineer'],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
  {
    id: 'complete',
    name: 'Launch! 🚀',
    description: 'Application is ready for deployment and user interaction.',
    agentIds: [],
    status: 'pending',
    progress: 0,
    outputs: [],
    debates: [],
  },
];

function generateStageOutputs(stage: PipelineStage, projectIdea: string, projectType: string): StageOutput[] {
  const outputTemplates: Record<string, StageOutput[]> = {
    'company-formation': [
      {
        id: 'out-cf-1',
        type: 'strategy',
        title: 'Company Vision Document',
        content: `# Company Vision\n\n## Mission\nTo build the best ${projectType} application that delights users and sets new standards in the industry.\n\n## Product: ${projectIdea}\n\n## Target Market\n- Primary: Tech-savvy users aged 18-35\n- Secondary: Professional users seeking productivity tools\n\n## Core Values\n1. User-first design\n2. Performance excellence\n3. Innovation\n4. Accessibility\n\n## Competitive Advantage\n- Superior user experience\n- Modern tech stack\n- AI-powered features\n- Real-time capabilities`,
        agentId: 'company-formation',
        timestamp: Date.now(),
      },
    ],
    'ceo-planning': [
      {
        id: 'out-ceo-1',
        type: 'strategy',
        title: 'Strategic Roadmap',
        content: `# Strategic Roadmap\n\n## Phase 1: MVP (Sprint 1-2)\n- Core feature implementation\n- Basic UI/UX\n- Essential API endpoints\n\n## Phase 2: Enhancement (Sprint 3-4)\n- Advanced features\n- Performance optimization\n- AI integration\n\n## Phase 3: Scale (Sprint 5-6)\n- Load testing & optimization\n- Marketing launch\n- User feedback integration\n\n## Success Metrics\n- User engagement: 70%+ DAU/MAU\n- Performance: <200ms API response\n- Quality: 95%+ test coverage\n- Growth: 1000 users in first month`,
        agentId: 'ceo',
        timestamp: Date.now(),
      },
    ],
    'project-management': [
      {
        id: 'out-pm-1',
        type: 'document',
        title: 'Sprint Plan',
        content: `# Sprint Plan\n\n## Sprint 1: Foundation\n| Task | Assignee | Story Points | Status |\n|------|----------|-------------|--------|\n| Project setup | DevOps | 3 | ✅ Done |\n| Database schema | DB Architect | 5 | ✅ Done |\n| API scaffolding | Backend | 5 | ✅ Done |\n| Design system | UI/UX | 8 | ✅ Done |\n| Component library | Frontend | 8 | ✅ Done |\n\n## Sprint 2: Core Features\n| Task | Assignee | Story Points | Status |\n|------|----------|-------------|--------|\n| Main feature logic | Backend | 13 | ✅ Done |\n| UI implementation | Frontend | 13 | ✅ Done |\n| Integration tests | QA | 8 | ✅ Done |\n| AI features | AI Engineer | 8 | ✅ Done |\n| Deployment setup | DevOps | 5 | ✅ Done |`,
        agentId: 'project-manager',
        timestamp: Date.now(),
      },
    ],
    'product-requirements': [
      {
        id: 'out-prod-1',
        type: 'document',
        title: 'Product Requirements Document',
        content: `# Product Requirements: ${projectIdea}\n\n## User Stories\n\n### Epic 1: Core Experience\n- **US-001**: As a user, I want to access the main feature easily\n  - Acceptance: Feature accessible from homepage in 1 click\n- **US-002**: As a user, I want real-time feedback on my actions\n  - Acceptance: UI updates within 100ms\n- **US-003**: As a user, I want my data to persist between sessions\n  - Acceptance: Data saved and restored correctly\n\n### Epic 2: Social & Engagement\n- **US-004**: As a user, I want to share my progress\n- **US-005**: As a user, I want to compete with others\n\n### Epic 3: Personalization\n- **US-006**: As a user, I want to customize my experience\n- **US-007**: As a user, I want AI-powered recommendations\n\n## Non-Functional Requirements\n- Performance: < 3s initial load\n- Accessibility: WCAG 2.1 AA\n- Security: OWASP Top 10 compliance`,
        agentId: 'product-manager',
        timestamp: Date.now(),
      },
    ],
    'ui-ux-design': [
      {
        id: 'out-ui-1',
        type: 'design',
        title: 'Design System Specification',
        content: `# Design System\n\n## Color Palette\n\`\`\`css\n:root {\n  --primary: #6366f1;\n  --primary-light: #818cf8;\n  --secondary: #ec4899;\n  --background: #0f172a;\n  --surface: #1e293b;\n  --text: #f8fafc;\n  --text-muted: #94a3b8;\n  --success: #10b981;\n  --warning: #f59e0b;\n  --error: #ef4444;\n}\n\`\`\`\n\n## Typography\n- Headings: Inter, 700 weight\n- Body: Inter, 400 weight\n- Code: JetBrains Mono, 400 weight\n\n## Spacing Scale\n4px | 8px | 12px | 16px | 24px | 32px | 48px | 64px\n\n## Border Radius\n- Small: 8px\n- Medium: 12px\n- Large: 16px\n- Full: 9999px\n\n## Shadows\n- Subtle: 0 1px 3px rgba(0,0,0,0.3)\n- Medium: 0 4px 6px rgba(0,0,0,0.4)\n- Large: 0 10px 25px rgba(0,0,0,0.5)\n\n## Components\n- Buttons: Gradient backgrounds, 16px padding, 12px radius\n- Cards: Glass morphism, backdrop-blur, border glow\n- Inputs: Dark surface, focus ring, smooth transitions`,
        agentId: 'ui-ux-designer',
        timestamp: Date.now(),
      },
    ],
    'frontend-development': [
      {
        id: 'out-fe-1',
        type: 'code',
        title: 'Component Architecture',
        language: 'typescript',
        content: `// Component Architecture\n// =====================\n\n// Layout Components\n// ├── AppShell\n// ├── Header\n// ├── Sidebar\n// └── Footer\n\n// Feature Components\n// ├── GameBoard / MainView\n// ├── ScoreBoard / Dashboard\n// ├── PlayerCard / UserProfile\n// └── SettingsPanel\n\n// Shared Components\n// ├── Button\n// ├── Card\n// ├── Modal\n// ├── Toast\n// └── Loading\n\nimport React from 'react';\n\n// Example: Main App Component\nconst App: React.FC = () => {\n  return (\n    <div className="app-shell">\n      <Header />\n      <main className="content">\n        <Sidebar />\n        <MainView />\n      </main>\n      <Footer />\n    </div>\n  );\n};\n\nexport default App;`,
        agentId: 'frontend-engineer',
        timestamp: Date.now(),
      },
    ],
    'backend-development': [
      {
        id: 'out-be-1',
        type: 'code',
        title: 'API Architecture',
        language: 'typescript',
        content: `// API Architecture\n// ================\n\n// Express.js REST API\nimport express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\n\nconst app = express();\n\n// Middleware\napp.use(cors());\napp.use(helmet());\napp.use(express.json());\n\n// Routes\n// GET    /api/v1/resources     - List all\n// POST   /api/v1/resources     - Create new\n// GET    /api/v1/resources/:id - Get by ID\n// PUT    /api/v1/resources/:id - Update\n// DELETE /api/v1/resources/:id - Delete\n\n// Health Check\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'healthy', uptime: process.uptime() });\n});\n\n// Error handling middleware\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Internal Server Error' });\n});\n\nexport default app;`,
        agentId: 'backend-engineer',
        timestamp: Date.now(),
      },
    ],
    'database-design': [
      {
        id: 'out-db-1',
        type: 'code',
        title: 'Database Schema',
        language: 'typescript',
        content: `// Database Schema Design\n// =====================\n\n// MongoDB Schema with Mongoose\nimport mongoose from 'mongoose';\n\nconst UserSchema = new mongoose.Schema({\n  username: { type: String, required: true, unique: true },\n  email: { type: String, required: true, unique: true },\n  passwordHash: { type: String, required: true },\n  profile: {\n    avatar: String,\n    displayName: String,\n    bio: String,\n  },\n  stats: {\n    gamesPlayed: { type: Number, default: 0 },\n    gamesWon: { type: Number, default: 0 },\n    streak: { type: Number, default: 0 },\n  },\n  createdAt: { type: Date, default: Date.now },\n  updatedAt: { type: Date, default: Date.now },\n});\n\nconst GameSchema = new mongoose.Schema({\n  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],\n  status: { type: String, enum: ['waiting', 'active', 'completed'] },\n  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n  moves: [{\n    player: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n    position: Number,\n    timestamp: Date,\n  }],\n  createdAt: { type: Date, default: Date.now },\n});\n\n// Indexes\nUserSchema.index({ email: 1 });\nGameSchema.index({ status: 1, createdAt: -1 });`,
        agentId: 'database-architect',
        timestamp: Date.now(),
      },
    ],
    'ai-integration': [
      {
        id: 'out-ai-1',
        type: 'code',
        title: 'AI Service Integration',
        language: 'typescript',
        content: `// AI Integration Service\n// =====================\n\ninterface AIConfig {\n  model: string;\n  temperature: number;\n  maxTokens: number;\n}\n\nclass AIService {\n  private config: AIConfig;\n\n  constructor(config: AIConfig) {\n    this.config = config;\n  }\n\n  // Smart suggestion engine\n  async getSuggestions(context: string): Promise<string[]> {\n    const prompt = \`Based on the current context: \${context}\n    Provide 3 intelligent suggestions.\`;\n    \n    // Gemini API call\n    return this.callAI(prompt);\n  }\n\n  // Difficulty adaptation\n  async adaptDifficulty(playerStats: any): Promise<number> {\n    // AI-powered difficulty scaling\n    const analysis = await this.callAI(\n      \`Analyze player performance and suggest difficulty: \${JSON.stringify(playerStats)}\`\n    );\n    return parseFloat(analysis[0]) || 0.5;\n  }\n\n  private async callAI(prompt: string): Promise<string[]> {\n    // Implementation with streaming support\n    return ['suggestion1', 'suggestion2', 'suggestion3'];\n  }\n}\n\nexport default AIService;`,
        agentId: 'ai-engineer',
        timestamp: Date.now(),
      },
    ],
    'testing': [
      {
        id: 'out-qa-1',
        type: 'test',
        title: 'Test Suite Report',
        content: `# Test Suite Report 🔍\n\n## Summary\n- **Total Tests**: 47\n- **Passed**: 44 ✅\n- **Failed**: 2 ❌ (Fixed)\n- **Skipped**: 1 ⏭️\n- **Coverage**: 89.3%\n\n## Unit Tests\n\`\`\`\n✅ Component renders correctly\n✅ State updates on user action\n✅ API calls return expected data\n✅ Error handling works correctly\n✅ Edge cases handled\n\`\`\`\n\n## Integration Tests\n\`\`\`\n✅ User flow: registration to gameplay\n✅ API integration with database\n✅ Real-time updates work\n✅ Authentication flow\n\`\`\`\n\n## Bugs Found & Fixed\n| Bug | Severity | Status |\n|-----|----------|--------|\n| Unhandled promise rejection | Critical | ✅ Fixed |\n| Race condition in state update | High | ✅ Fixed |\n| Missing input validation | Medium | ✅ Fixed |\n\n## Performance\n- Initial load: 1.2s ✅\n- API response: 89ms ✅\n- Bundle size: 245KB ✅`,
        agentId: 'qa-engineer',
        timestamp: Date.now(),
      },
    ],
    'deployment': [
      {
        id: 'out-devops-1',
        type: 'config',
        title: 'Deployment Configuration',
        language: 'yaml',
        content: `# Docker Compose Configuration\nversion: '3.8'\n\nservices:\n  frontend:\n    build:\n      context: ./frontend\n      dockerfile: Dockerfile\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n      - API_URL=http://backend:4000\n    depends_on:\n      - backend\n\n  backend:\n    build:\n      context: ./backend\n      dockerfile: Dockerfile\n    ports:\n      - "4000:4000"\n    environment:\n      - NODE_ENV=production\n      - DATABASE_URL=mongodb://db:27017/app\n      - JWT_SECRET=\${JWT_SECRET}\n    depends_on:\n      - db\n\n  db:\n    image: mongo:7\n    ports:\n      - "27017:27017"\n    volumes:\n      - mongo_data:/data/db\n\nvolumes:\n  mongo_data:`,
        agentId: 'devops-engineer',
        timestamp: Date.now(),
      },
    ],
    'marketing': [
      {
        id: 'out-mkt-1',
        type: 'strategy',
        title: 'Launch Marketing Plan',
        content: `# Marketing Launch Plan 📢\n\n## Brand Messaging\n**Tagline**: "Build the Future, Play Today"\n\n## Launch Strategy\n\n### Week 1: Pre-Launch\n- Teaser campaign on social media\n- Developer community outreach\n- Beta sign-ups\n\n### Week 2: Launch Day\n- Product Hunt launch\n- Press release\n- Influencer demos\n- Social media blitz\n\n### Week 3-4: Growth\n- User testimonials\n- Feature showcase videos\n- Community building\n- Referral program\n\n## Channels\n- Twitter/X: Daily updates\n- Reddit: Community engagement\n- Discord: User community\n- YouTube: Demo videos\n- Dev.to: Technical articles\n\n## Metrics\n- Target: 1,000 users in 30 days\n- Engagement: 70% retention\n- NPS: 50+`,
        agentId: 'marketing-manager',
        timestamp: Date.now(),
      },
    ],
    'building': [],
    'complete': [],
  };

  return outputTemplates[stage] || [];
}

export function initializeProject(idea: string): ProjectState {
  const projectType = detectProjectType(idea);
  const projectName = generateProjectName(idea);

  const stages = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    outputs: [],
    debates: generateDebatesForStage(stage.id as PipelineStage, idea, projectType),
    status: 'pending' as const,
    progress: 0,
  }));

  const agents: AgentRuntimeState[] = [
    'company-formation', 'ceo', 'project-manager', 'product-manager',
    'ui-ux-designer', 'frontend-engineer', 'backend-engineer',
    'database-architect', 'ai-engineer', 'qa-engineer',
    'devops-engineer', 'marketing-manager',
  ].map((id) => ({
    agentId: id,
    status: 'idle' as const,
    mood: 'thinking' as const,
    contributionScore: 0,
    debatesWon: 0,
    debatesLost: 0,
    outputCount: 0,
  }));

  return {
    id: `project-${Date.now()}`,
    idea,
    projectName,
    projectType,
    currentStage: 'company-formation',
    stages,
    agents,
    generatedFiles: [],
    totalDebates: 0,
    totalDecisions: 0,
    startTime: Date.now(),
    isComplete: false,
  };
}

export function processStage(project: ProjectState, stageId: PipelineStage): ProjectState {
  const stageIndex = project.stages.findIndex((s) => s.id === stageId);
  if (stageIndex === -1) return project;

  const stage = { ...project.stages[stageIndex] };
  stage.status = 'complete';
  stage.progress = 100;
  stage.startTime = Date.now() - 5000;
  stage.endTime = Date.now();

  // Generate outputs
  stage.outputs = generateStageOutputs(stageId, project.idea, project.projectType);

  // Update stages array
  const newStages = [...project.stages];
  newStages[stageIndex] = stage;

  // Activate next stage
  if (stageIndex + 1 < newStages.length) {
    newStages[stageIndex + 1] = {
      ...newStages[stageIndex + 1],
      status: 'active',
      progress: 0,
    };
  }

  // Update agent states
  const newAgents = project.agents.map((agent) => {
    if (stage.agentIds.includes(agent.agentId)) {
      return {
        ...agent,
        status: 'done' as const,
        mood: 'satisfied' as const,
        contributionScore: agent.contributionScore + 10,
        outputCount: agent.outputCount + stage.outputs.filter((o) => o.agentId === agent.agentId).length,
        debatesWon: agent.debatesWon + Math.floor(Math.random() * 3),
      };
    }
    // Activate next stage's agents
    const nextStage = stageIndex + 1 < newStages.length ? newStages[stageIndex + 1] : null;
    if (nextStage && nextStage.agentIds.includes(agent.agentId)) {
      return {
        ...agent,
        status: 'working' as const,
        mood: 'focused' as const,
      };
    }
    return agent;
  });

  // Count total debates
  const totalDebates = newStages.reduce((sum, s) => sum + s.debates.length, 0);
  const totalDecisions = newStages.reduce(
    (sum, s) => sum + s.debates.reduce(
      (dSum, d) => dSum + d.messages.filter((m) => m.type === 'decision' || m.type === 'agreement').length, 0
    ), 0
  );

  // Generate files when building stage completes
  let generatedFiles = project.generatedFiles;
  if (stageId === 'building') {
    generatedFiles = generateProjectFiles(project.idea, project.projectType);
  }

  const nextStageId = stageIndex + 1 < newStages.length
    ? newStages[stageIndex + 1].id as PipelineStage
    : 'complete';

  return {
    ...project,
    currentStage: nextStageId,
    stages: newStages,
    agents: newAgents,
    generatedFiles,
    totalDebates,
    totalDecisions,
    isComplete: nextStageId === 'complete' && stageId === 'complete',
  };
}

function detectProjectType(idea: string): string {
  const lower = idea.toLowerCase();
  if (lower.includes('game') || lower.includes('tic-tac-toe') || lower.includes('chess') || lower.includes('puzzle')) {
    return 'game';
  }
  if (lower.includes('habit') || lower.includes('tracker') || lower.includes('todo') || lower.includes('task')) {
    return 'productivity';
  }
  if (lower.includes('chat') || lower.includes('social') || lower.includes('message')) {
    return 'social';
  }
  if (lower.includes('dashboard') || lower.includes('analytics') || lower.includes('data')) {
    return 'dashboard';
  }
  if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store')) {
    return 'ecommerce';
  }
  return 'web-app';
}

function generateProjectName(idea: string): string {
  const words = idea.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => !['a', 'an', 'the', 'build', 'create', 'make', 'develop'].includes(w))
    .slice(0, 3);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('') || 'MyProject';
}

export const getStageIndex = (stageId: PipelineStage): number =>
  PIPELINE_STAGES.findIndex((s) => s.id === stageId);

export const getStageProgress = (project: ProjectState): number => {
  const completedStages = project.stages.filter((s) => s.status === 'complete').length;
  return Math.round((completedStages / project.stages.length) * 100);
};
