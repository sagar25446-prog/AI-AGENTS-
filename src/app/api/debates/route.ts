import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { callBharatCode } from '@/lib/bharatcode';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

async function callGeminiFallback(contents: string, config: any) {
  let lastError: any;
  for (const model of GEMINI_MODELS) {
    try {
      console.log(`[debates] Trying Gemini fallback model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      console.log(`[debates] Success with Gemini fallback: ${model}`);
      return response.text || '{}';
    } catch (err: any) {
      console.error(`[debates] Gemini model ${model} failed:`, err.message);
      lastError = err;
      if (err.status && ![404, 429, 503].includes(err.status)) {
        throw err;
      }
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const { idea, projectType } = await request.json();

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }

    const prompt = `You are the Debate Engine for an AI Company Simulator.
Your job is to generate realistic, heated, and HIGHLY CONTEXTUAL debates between AI agents about how to build this specific product:

USER'S IDEA: "${idea}"
PROJECT TYPE: "${projectType}"

IMPORTANT: Every single message MUST reference the specific product "${idea}" by name. 
Do NOT use generic placeholder text. Be specific about features, UI choices, colors, architecture, and technical decisions for THIS exact app.

Generate debates for these 6 stages. Each stage has specific agents who participate:

1. "company-formation" (Agents: company-formation, ceo, marketing-manager)
   - They argue about market positioning and target audience for "${idea}"
   
2. "ceo-planning" (Agents: ceo, project-manager, product-manager)
   - They fight about timeline, priorities, and which features of "${idea}" to build first

3. "product-requirements" (Agents: product-manager, ui-ux-designer, frontend-engineer)
   - They debate the exact features and user experience for "${idea}"

4. "ui-ux-design" (Agents: ui-ux-designer, frontend-engineer, marketing-manager)
   - They argue about colors, layout, animations, and visual style for "${idea}"

5. "frontend-development" (Agents: frontend-engineer, backend-engineer, ui-ux-designer)
   - They fight about tech stack, component architecture, and state management for "${idea}"

6. "backend-development" (Agents: backend-engineer, database-architect, devops-engineer)
   - They debate API design, database schema, and deployment strategy for "${idea}"

RULES:
- Each stage gets exactly 1 debate with 5-6 messages
- Messages should feel like real passionate developers arguing
- Include specific technical details relevant to "${idea}"
- Some agents should disagree strongly, then reach compromise
- Use intensity values between 3-9

Output this exact JSON structure:
{
  "company-formation": [{
    "id": "debate-cf-1",
    "topic": "string",
    "status": "resolved",
    "intensity": 7,
    "participants": ["company-formation", "ceo", "marketing-manager"],
    "messages": [{
      "id": "msg-cf-1",
      "agentId": "ceo",
      "content": "string mentioning ${idea} specifically",
      "type": "proposal",
      "intensity": 6
    }]
  }],
  "ceo-planning": [{
    "id": "debate-cp-1",
    "topic": "string",
    "status": "resolved",
    "intensity": 7,
    "participants": ["ceo", "project-manager", "product-manager"],
    "messages": [{
      "id": "msg-cp-1",
      "agentId": "ceo",
      "content": "string mentioning ${idea} specifically",
      "type": "proposal",
      "intensity": 6
    }]
  }],
  "product-requirements": [{
    "id": "debate-pr-1",
    "topic": "string",
    "status": "resolved",
    "intensity": 7,
    "participants": ["product-manager", "ui-ux-designer", "frontend-engineer"],
    "messages": [{
      "id": "msg-pr-1",
      "agentId": "product-manager",
      "content": "string mentioning ${idea} specifically",
      "type": "proposal",
      "intensity": 6
    }]
  }],
  "ui-ux-design": [{
    "id": "debate-ud-1",
    "topic": "string",
    "status": "resolved",
    "intensity": 7,
    "participants": ["ui-ux-designer", "frontend-engineer", "marketing-manager"],
    "messages": [{
      "id": "msg-ud-1",
      "agentId": "ui-ux-designer",
      "content": "string mentioning ${idea} specifically",
      "type": "proposal",
      "intensity": 6
    }]
  }],
  "frontend-development": [{
    "id": "debate-fd-1",
    "topic": "string",
    "status": "resolved",
    "intensity": 7,
    "participants": ["frontend-engineer", "backend-engineer", "ui-ux-designer"],
    "messages": [{
      "id": "msg-fd-1",
      "agentId": "frontend-engineer",
      "content": "string mentioning ${idea} specifically",
      "type": "proposal",
      "intensity": 6
    }]
  }],
  "backend-development": [{
    "id": "debate-bd-1",
    "topic": "string",
    "status": "resolved",
    "intensity": 7,
    "participants": ["backend-engineer", "database-architect", "devops-engineer"],
    "messages": [{
      "id": "msg-bd-1",
      "agentId": "backend-engineer",
      "content": "string mentioning ${idea} specifically",
      "type": "proposal",
      "intensity": 6
    }]
  }]
}

Valid message types: "proposal", "challenge", "counter-argument", "agreement", "decision", "compromise"
Valid agentIds per stage are listed above.

Respond with ONLY the JSON object. No markdown, no explanation.`;

    let jsonText = '';

    // Primary: BharatCode Model API
    if (process.env.BHARATCODE_API_KEY) {
      try {
        console.log('[debates] Calling BharatCode Model API for agent debates...');
        jsonText = await callBharatCode(
          [
            {
              role: 'system',
              content: 'You are an autonomous Multi-Agent Debate Engine outputting strict, valid JSON matching the exact schema requested.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          {
            temperature: 0.8,
            max_tokens: 3500,
          }
        );
        console.log('[debates] Successfully generated debates via BharatCode Model API!');
      } catch (bcError: any) {
        console.warn('[debates] BharatCode API error, attempting fallback:', bcError.message);
        if (process.env.GEMINI_API_KEY) {
          jsonText = await callGeminiFallback(prompt, {
            temperature: 0.8,
            responseMimeType: 'application/json',
          });
        } else {
          throw bcError;
        }
      }
    } else if (process.env.GEMINI_API_KEY) {
      jsonText = await callGeminiFallback(prompt, {
        temperature: 0.8,
        responseMimeType: 'application/json',
      });
    } else {
      return NextResponse.json(
        { error: 'Neither BHARATCODE_API_KEY nor GEMINI_API_KEY configured' },
        { status: 500 }
      );
    }

    // Try to extract JSON if wrapped in code fences
    const jsonMatch = jsonText.match(/```(?:json)?\s*\n([\s\S]*?)```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonText);

    // Validate that we got actual debate data
    const stageKeys = Object.keys(parsed);
    if (stageKeys.length === 0) {
      return NextResponse.json({ error: 'Empty debate data' }, { status: 500 });
    }

    console.log(`[debates] Generated debates for ${stageKeys.length} stages: ${stageKeys.join(', ')}`);
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error generating debates:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate debates' }, { status: 500 });
  }
}
