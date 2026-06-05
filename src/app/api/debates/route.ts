import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

async function callWithFallback(contents: string, config: any) {
  let lastError: any;
  for (const model of MODELS) {
    try {
      console.log(`[debates] Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      console.log(`[debates] Success with model: ${model}`);
      return response;
    } catch (err: any) {
      console.error(`[debates] Model ${model} failed:`, err.message);
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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
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
  "ceo-planning": [{ same structure }],
  "product-requirements": [{ same structure }],
  "ui-ux-design": [{ same structure }],
  "frontend-development": [{ same structure }],
  "backend-development": [{ same structure }]
}

Valid message types: "proposal", "challenge", "counter-argument", "agreement", "decision", "compromise"
Valid agentIds per stage are listed above.

Respond with ONLY the JSON object. No markdown, no explanation.`;

    const response = await callWithFallback(prompt, {
      temperature: 0.8,
      responseMimeType: 'application/json',
    });

    let jsonText = response.text || '{}';
    
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
