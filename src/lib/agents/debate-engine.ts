// ============================================================
// Debate Engine — Generates realistic agent debates & fights
// ============================================================

import { Debate, DebateMessage, MessageType, PipelineStage } from './types';
import { AGENT_PROFILES, getAgentById } from './agent-profiles';

let messageIdCounter = 0;
const genId = () => `msg-${++messageIdCounter}-${Date.now()}`;

// Debate templates for each pipeline stage
interface DebateTemplate {
  topic: string;
  participants: string[];
  exchanges: {
    agentId: string;
    type: MessageType;
    templates: string[];
    intensity: number;
  }[];
}

const DEBATE_TEMPLATES: Record<string, DebateTemplate[]> = {
  'company-formation': [
    {
      topic: 'Defining the Project Vision & Target Market',
      participants: ['company-formation', 'ceo', 'marketing-manager'],
      exchanges: [
        { agentId: 'company-formation', type: 'proposal', templates: [
          "Based on my analysis, we should position this as a {category} product targeting {audience}. The market opportunity is significant.",
          "I've analyzed the competitive landscape. Here's our positioning strategy: we differentiate through {diff}.",
        ], intensity: 3 },
        { agentId: 'ceo', type: 'challenge', templates: [
          "That's thinking too small. We need to target a MUCH larger market. What about {biggerMarket}?",
          "I disagree with the positioning. We should be more aggressive. Our competitors are {competitors} — we need to crush them.",
        ], intensity: 7 },
        { agentId: 'marketing-manager', type: 'counter-argument', templates: [
          "Hold on, Victoria. If we target too broadly, we'll lose focus. Let me present the data: {data}",
          "I actually agree with Atlas's market analysis, but the MESSAGING needs to be sharper. We need a hook.",
        ], intensity: 5 },
        { agentId: 'ceo', type: 'counter-argument', templates: [
          "Fine. But I want to see aggressive growth projections. We're not building this to be mediocre.",
          "Alright, but we need to ensure our go-to-market strategy is bulletproof. What's the launch plan?",
        ], intensity: 6 },
        { agentId: 'company-formation', type: 'compromise', templates: [
          "Here's my updated proposal: we start focused on {niche}, then expand to {broader} after product-market fit.",
        ], intensity: 3 },
        { agentId: 'ceo', type: 'agreement', templates: [
          "NOW we're talking. Let's move forward with this approach. I want the product team briefed in 5 minutes.",
        ], intensity: 4 },
      ],
    },
  ],
  'ceo-planning': [
    {
      topic: 'Strategic Roadmap & Development Priorities',
      participants: ['ceo', 'project-manager', 'product-manager'],
      exchanges: [
        { agentId: 'ceo', type: 'proposal', templates: [
          "Here's the strategic roadmap: MVP in 2 sprints, full launch in 4 sprints. I want ALL features in the first release.",
          "Our priority is speed to market. I want the core product ready ASAP. No shortcuts on quality though.",
        ], intensity: 6 },
        { agentId: 'project-manager', type: 'challenge', templates: [
          "Victoria, that timeline is unrealistic. We need at least 6 sprints for a quality product. Let me show you the resource allocation.",
          "I appreciate the ambition, but cramming all features into v1 is a recipe for disaster. We need to phase this.",
        ], intensity: 7 },
        { agentId: 'product-manager', type: 'counter-argument', templates: [
          "Marcus is right about phasing, but I think we can be more aggressive on CORE features. Here's what users actually need in v1: {features}",
          "Let me prioritize: {p1} are must-haves, {p2} are nice-to-haves. We ship must-haves first.",
        ], intensity: 5 },
        { agentId: 'ceo', type: 'counter-argument', templates: [
          "I hear you both, but the competition won't wait. What if we parallelized the workstreams?",
        ], intensity: 8 },
        { agentId: 'project-manager', type: 'compromise', templates: [
          "Okay, here's a revised plan: 3 sprints for MVP with core features, then iterate. I can make this work if we prioritize ruthlessly.",
        ], intensity: 4 },
        { agentId: 'ceo', type: 'decision', templates: [
          "Approved. Let's execute. Sophia, get the requirements finalized. Marcus, I want daily standups.",
        ], intensity: 5 },
      ],
    },
  ],
  'product-requirements': [
    {
      topic: 'Feature Scope & User Experience Requirements',
      participants: ['product-manager', 'ui-ux-designer', 'frontend-engineer'],
      exchanges: [
        { agentId: 'product-manager', type: 'proposal', templates: [
          "Here are the core user stories I've defined: {stories}. Each maps to a critical user need.",
          "Based on my user research, the key features are: {features}. I've prioritized them by impact.",
        ], intensity: 4 },
        { agentId: 'ui-ux-designer', type: 'challenge', templates: [
          "These features are fine, but the USER FLOW is wrong. Users will get lost at step 3. Let me redesign this.",
          "I have major concerns about the navigation structure. Users need to access {feature} in 2 clicks, not 5.",
        ], intensity: 7 },
        { agentId: 'frontend-engineer', type: 'counter-argument', templates: [
          "Luna, that redesign will require 3x more components. Can we find a middle ground?",
          "I can implement either approach, but Luna's version will need custom animations. Worth it? Let me prototype both.",
        ], intensity: 5 },
        { agentId: 'ui-ux-designer', type: 'counter-argument', templates: [
          "The extra components are WORTH IT. User experience is not optional. I refuse to ship a confusing interface.",
          "Fine, let me simplify the design while keeping the user flow improvements. Here's version 2.",
        ], intensity: 8 },
        { agentId: 'product-manager', type: 'agreement', templates: [
          "Luna's v2 is actually better than my original. Let me update the requirements to match.",
        ], intensity: 3 },
        { agentId: 'frontend-engineer', type: 'agreement', templates: [
          "I can work with this. Let me start the component architecture. Should be clean and reusable.",
        ], intensity: 3 },
      ],
    },
  ],
  'ui-ux-design': [
    {
      topic: 'Visual Design System & Component Architecture',
      participants: ['ui-ux-designer', 'frontend-engineer', 'product-manager'],
      exchanges: [
        { agentId: 'ui-ux-designer', type: 'proposal', templates: [
          "Here's the design system: primary palette uses {colors}, with {typography} for typography. Every component follows the 8px grid.",
          "I've designed the complete UI kit. Clean, modern, accessible. Every interaction has been carefully considered.",
        ], intensity: 4 },
        { agentId: 'frontend-engineer', type: 'challenge', templates: [
          "Luna, these animations will kill performance on lower-end devices. Can we simplify the hover effects?",
          "The design looks amazing, but the component structure needs rethinking for reusability. Let me suggest an alternative.",
        ], intensity: 6 },
        { agentId: 'ui-ux-designer', type: 'counter-argument', templates: [
          "Performance is important, but I will NOT sacrifice visual quality. Let me optimize the animations instead — CSS only, no JS.",
          "FINE. But the border-radius stays at 12px. I'm not negotiating on that. 😤",
        ], intensity: 8 },
        { agentId: 'product-manager', type: 'compromise', templates: [
          "Both of you make valid points. How about we have full animations on desktop and simplified ones on mobile?",
        ], intensity: 3 },
        { agentId: 'frontend-engineer', type: 'agreement', templates: [
          "That works. I'll implement responsive animations. Luna, send me the final specs.",
        ], intensity: 3 },
        { agentId: 'ui-ux-designer', type: 'agreement', templates: [
          "Deal. Here are the final design tokens and component specifications. Don't change my colors. 🎨",
        ], intensity: 4 },
      ],
    },
  ],
  'frontend-development': [
    {
      topic: 'Frontend Architecture & Implementation',
      participants: ['frontend-engineer', 'qa-engineer', 'ui-ux-designer'],
      exchanges: [
        { agentId: 'frontend-engineer', type: 'proposal', templates: [
          "I'm going with React + Next.js for the frontend. Component-based architecture with Zustand for state management.",
          "Here's my implementation plan: {plan}. Clean, modular, performant.",
        ], intensity: 4 },
        { agentId: 'qa-engineer', type: 'challenge', templates: [
          "Where are the tests? I see ZERO test coverage in your plan. This is unacceptable.",
          "I've already found potential issues: {issues}. Your error handling needs work.",
        ], intensity: 9 },
        { agentId: 'frontend-engineer', type: 'counter-argument', templates: [
          "Bug-Buster, I was going to add tests in the next sprint. Let me focus on getting the UI right first.",
          "Fine, I'll add unit tests for every component. Happy now?",
        ], intensity: 6 },
        { agentId: 'ui-ux-designer', type: 'challenge', templates: [
          "Wait — the button padding is 14px in your code. I specified 16px. FIX. IT. NOW. 😡",
          "The animations aren't smooth. I can see the jank. Use transform instead of top/left.",
        ], intensity: 8 },
        { agentId: 'frontend-engineer', type: 'agreement', templates: [
          "Okay okay! Padding fixed to 16px, animations refactored to use transforms. Everyone happy?",
        ], intensity: 5 },
        { agentId: 'qa-engineer', type: 'agreement', templates: [
          "Better. I'll run the test suite and report back. Don't think you're off the hook yet.",
        ], intensity: 6 },
      ],
    },
  ],
  'backend-development': [
    {
      topic: 'API Design & Backend Architecture',
      participants: ['backend-engineer', 'database-architect', 'qa-engineer'],
      exchanges: [
        { agentId: 'backend-engineer', type: 'proposal', templates: [
          "I'm building a RESTful API with Express.js. Clean endpoint design, proper middleware stack, JWT auth.",
          "Here's the API architecture: {endpoints}. Rate limiting, validation, error handling — all covered.",
        ], intensity: 4 },
        { agentId: 'database-architect', type: 'challenge', templates: [
          "Your data access patterns will cause N+1 queries. Let me redesign the query layer.",
          "The schema doesn't match your API structure. We need to align on the data model first.",
        ], intensity: 7 },
        { agentId: 'qa-engineer', type: 'challenge', templates: [
          "What happens when the database is down? Where's your circuit breaker? This will crash in production.",
          "I tested your API with 1000 concurrent requests. It died at 200. Fix the connection pooling.",
        ], intensity: 9 },
        { agentId: 'backend-engineer', type: 'counter-argument', templates: [
          "Schema, you're right about the N+1 issue. Let me implement batch loading. Bug-Buster, I'll add circuit breakers.",
          "Alright, here's the revised architecture with connection pooling and graceful degradation.",
        ], intensity: 5 },
        { agentId: 'database-architect', type: 'agreement', templates: [
          "The revised query patterns look good. I'll prepare the optimized indexes.",
        ], intensity: 3 },
        { agentId: 'qa-engineer', type: 'agreement', templates: [
          "Load test passed at 500 RPS now. Acceptable. But I'm watching you.",
        ], intensity: 5 },
      ],
    },
  ],
  'database-design': [
    {
      topic: 'Data Model & Schema Design',
      participants: ['database-architect', 'backend-engineer', 'product-manager'],
      exchanges: [
        { agentId: 'database-architect', type: 'proposal', templates: [
          "Here's the normalized schema design. Every relationship is properly indexed. Query performance will be optimal.",
          "I recommend MongoDB for this project. The data model suits document storage. Here are the schemas.",
        ], intensity: 4 },
        { agentId: 'backend-engineer', type: 'challenge', templates: [
          "Schema, this is over-normalized. Some of these joins will be expensive. Can we denormalize the {entity}?",
        ], intensity: 6 },
        { agentId: 'database-architect', type: 'counter-argument', templates: [
          "Denormalize?! That's how you get data inconsistency! But... fine. For read-heavy paths, I'll allow it.",
        ], intensity: 8 },
        { agentId: 'product-manager', type: 'counter-argument', templates: [
          "We also need to think about {dataPrivacy}. User data handling has compliance requirements.",
        ], intensity: 4 },
        { agentId: 'database-architect', type: 'agreement', templates: [
          "Good point, Sophia. I'll add data encryption at rest and implement proper access controls.",
        ], intensity: 3 },
      ],
    },
  ],
  'ai-integration': [
    {
      topic: 'AI Features & Integration Strategy',
      participants: ['ai-engineer', 'backend-engineer', 'product-manager'],
      exchanges: [
        { agentId: 'ai-engineer', type: 'proposal', templates: [
          "I want to add AI-powered {feature}. Using Gemini API with carefully crafted prompts for optimal results.",
          "Here's my AI integration plan: {plan}. We can make the product 10x smarter with these additions.",
        ], intensity: 5 },
        { agentId: 'backend-engineer', type: 'challenge', templates: [
          "Neural, every AI call adds 2-3 seconds of latency. We need to be strategic about where we use AI.",
          "The API costs will be significant. Can we cache AI responses for similar queries?",
        ], intensity: 6 },
        { agentId: 'product-manager', type: 'challenge', templates: [
          "Do users actually NEED AI here, or are we adding it because it's cool? Let's validate the use case.",
        ], intensity: 5 },
        { agentId: 'ai-engineer', type: 'counter-argument', templates: [
          "I'll implement streaming responses to reduce perceived latency. And yes, caching is a great idea.",
          "Trust me, users will love this. The AI features are the differentiator. Let me demo it.",
        ], intensity: 7 },
        { agentId: 'product-manager', type: 'agreement', templates: [
          "Okay, the demo convinced me. But let's make it optional — users who don't want AI can skip it.",
        ], intensity: 3 },
      ],
    },
  ],
  'testing': [
    {
      topic: 'Quality Assurance & Test Coverage',
      participants: ['qa-engineer', 'frontend-engineer', 'backend-engineer'],
      exchanges: [
        { agentId: 'qa-engineer', type: 'announcement', templates: [
          "ATTENTION EVERYONE. I've completed my review and I have CONCERNS. 🚨",
          "Test results are in. Sit down for this. It's going to hurt.",
        ], intensity: 8 },
        { agentId: 'qa-engineer', type: 'challenge', templates: [
          "Frontend: {frontendBugs} bugs found. Backend: {backendBugs} bugs found. Total test coverage: {coverage}%. UNACCEPTABLE.",
          "I found a critical bug: {criticalBug}. This would have crashed in production. How did this slip through?!",
        ], intensity: 10 },
        { agentId: 'frontend-engineer', type: 'counter-argument', templates: [
          "Those aren't bugs, they're FEATURES! ...okay fine, let me fix the critical ones.",
          "3 of those are edge cases that users will never hit. But fine, I'll fix all of them.",
        ], intensity: 6 },
        { agentId: 'backend-engineer', type: 'counter-argument', templates: [
          "The API bugs are valid. Give me 30 minutes. I'll patch them and add regression tests.",
        ], intensity: 4 },
        { agentId: 'qa-engineer', type: 'agreement', templates: [
          "All critical bugs fixed. Coverage is now at {newCoverage}%. I'll allow it. But I'm adding more tests.",
        ], intensity: 5 },
      ],
    },
  ],
  'deployment': [
    {
      topic: 'Deployment Strategy & Infrastructure',
      participants: ['devops-engineer', 'backend-engineer', 'ceo'],
      exchanges: [
        { agentId: 'devops-engineer', type: 'proposal', templates: [
          "Here's the deployment plan: Docker containers, CI/CD with GitHub Actions, auto-scaling on AWS.",
          "I've prepared the infrastructure: {infra}. Zero-downtime deployments with blue-green strategy.",
        ], intensity: 4 },
        { agentId: 'ceo', type: 'challenge', templates: [
          "How fast can we deploy? I need this live TODAY.",
          "What's our disaster recovery plan? I don't want to explain downtime to users.",
        ], intensity: 7 },
        { agentId: 'backend-engineer', type: 'challenge', templates: [
          "Deploy-X, the health checks need to be more thorough. Don't just ping — validate the full stack.",
        ], intensity: 5 },
        { agentId: 'devops-engineer', type: 'agreement', templates: [
          "Enhanced health checks added. Deployment pipeline is ready. One click to production. 🚀",
        ], intensity: 4 },
        { agentId: 'ceo', type: 'decision', templates: [
          "Ship it. NOW. 🚀",
        ], intensity: 6 },
      ],
    },
  ],
  'marketing': [
    {
      topic: 'Launch Strategy & Growth Plan',
      participants: ['marketing-manager', 'ceo', 'product-manager'],
      exchanges: [
        { agentId: 'marketing-manager', type: 'proposal', templates: [
          "Here's the launch plan: social media blitz, Product Hunt launch, developer community outreach.",
          "Our messaging: '{tagline}'. We lead with the unique value prop and let the product speak.",
        ], intensity: 5 },
        { agentId: 'ceo', type: 'challenge', templates: [
          "The messaging needs to be BOLDER. We're not just another {category} tool. We're REVOLUTIONARY.",
          "I want 10x more aggressive growth targets. What's our viral coefficient?",
        ], intensity: 8 },
        { agentId: 'product-manager', type: 'counter-argument', templates: [
          "Let's be honest about what we've built. Over-promising will hurt us. Focus on genuine value.",
        ], intensity: 5 },
        { agentId: 'marketing-manager', type: 'compromise', templates: [
          "How about this: we lead with a bold vision but back it with real demos. Best of both worlds.",
        ], intensity: 4 },
        { agentId: 'ceo', type: 'agreement', templates: [
          "I like it. Make it happen, Buzz. Let's make some noise. 📢",
        ], intensity: 5 },
      ],
    },
  ],
};

// Contextual fill-ins based on project type
function fillTemplate(template: string, context: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(context)) {
    result = result.replace(`{${key}}`, value);
  }
  // Remove any unfilled placeholders
  result = result.replace(/\{[^}]+\}/g, (match) => {
    const fallbacks: Record<string, string> = {
      '{category}': 'interactive application',
      '{audience}': 'modern digital users',
      '{diff}': 'superior user experience and innovative features',
      '{biggerMarket}': 'the entire consumer market',
      '{competitors}': 'established players',
      '{data}': 'our market research shows focused approach wins',
      '{niche}': 'our core user segment',
      '{broader}': 'adjacent markets',
      '{features}': 'core functionality, intuitive UI, real-time sync',
      '{p1}': 'core features',
      '{p2}': 'enhanced features',
      '{stories}': 'key user journeys covering the main workflows',
      '{feature}': 'the main feature',
      '{colors}': 'a vibrant modern palette',
      '{typography}': 'Inter for UI, JetBrains Mono for code',
      '{plan}': 'modular, scalable, well-tested architecture',
      '{issues}': 'missing error boundaries, no loading states, accessibility gaps',
      '{endpoints}': 'RESTful endpoints with full CRUD operations',
      '{entity}': 'frequently accessed entities',
      '{dataPrivacy}': 'GDPR compliance and data encryption',
      '{frontendBugs}': '12',
      '{backendBugs}': '8',
      '{coverage}': '67',
      '{criticalBug}': 'unhandled promise rejection in the main flow',
      '{newCoverage}': '89',
      '{infra}': 'containerized with health checks and monitoring',
      '{tagline}': 'Build the Future, Today',
    };
    return fallbacks[match] || match.slice(1, -1);
  });
  return result;
}

export function generateDebatesForStage(
  stage: PipelineStage,
  projectIdea: string,
  projectType: string
): Debate[] {
  const stageKey = stage as string;
  const templates = DEBATE_TEMPLATES[stageKey];
  if (!templates) return [];

  const context: Record<string, string> = {
    projectIdea,
    projectType,
    category: projectType,
  };

  return templates.map((template, index) => {
    const messages: DebateMessage[] = template.exchanges.map((exchange, i) => {
      const agent = getAgentById(exchange.agentId);
      const templateText = exchange.templates[Math.floor(Math.random() * exchange.templates.length)];
      const content = fillTemplate(templateText, context);

      return {
        id: genId(),
        agentId: exchange.agentId,
        type: exchange.type,
        content,
        timestamp: Date.now() + i * 2000,
        intensity: exchange.intensity,
        reactions: i > 0 && Math.random() > 0.5 ? [
          {
            agentId: template.participants[Math.floor(Math.random() * template.participants.length)],
            emoji: exchange.intensity > 7 ? '🔥' : exchange.type === 'agreement' ? '✅' : '🤔',
          },
        ] : undefined,
      };
    });

    const maxIntensity = Math.max(...template.exchanges.map(e => e.intensity));

    return {
      id: `debate-${stageKey}-${index}`,
      topic: template.topic,
      participants: template.participants,
      messages,
      status: 'resolved' as const,
      resolution: 'Consensus reached after productive debate',
      intensity: maxIntensity,
      startTime: Date.now(),
      endTime: Date.now() + messages.length * 2000,
    };
  });
}

export function getAllDebateMessages(debates: Debate[]): DebateMessage[] {
  return debates.flatMap(d => d.messages).sort((a, b) => a.timestamp - b.timestamp);
}
