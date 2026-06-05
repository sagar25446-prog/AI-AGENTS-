import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Try multiple models in case one is unavailable
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

async function callWithFallback(contents: string, config: any) {
  let lastError: any;
  for (const model of MODELS) {
    try {
      console.log(`[generate] Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      console.log(`[generate] Success with model: ${model}`);
      return response;
    } catch (err: any) {
      console.error(`[generate] Model ${model} failed:`, err.message);
      lastError = err;
      // Only retry on 404, 429, 503 — not on auth errors
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

    const prompt = `You are an expert Senior Web Developer. Your task is to build a completely functional, single-file HTML/JavaScript/TailwindCSS web application based on this idea:

IDEA: "${idea}"
PROJECT TYPE: "${projectType}"

CRITICAL REQUIREMENTS:
1. Output ONLY valid HTML code. No markdown, no backticks, no explanations. Just raw HTML starting with <!DOCTYPE html>.
2. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Include ALL CSS inside <style> tags and ALL JavaScript inside <script> tags.
4. The application MUST be fully interactive and functional:
   - If it's a game, it must be fully playable with win/lose conditions
   - If it's a productivity tool, it must have working add/edit/delete functionality
   - If it's an alarm app, it must have working time picker, alarm setting, and notification/sound
   - If it's a calculator, all buttons must work correctly
5. Use a beautiful dark theme with modern styling, gradients, glassmorphism, and smooth transitions.
6. All JavaScript logic must be complete, bug-free, and handle edge cases.
7. The app must work entirely standalone in a single HTML file with no external dependencies except TailwindCSS CDN.

Begin your response with <!DOCTYPE html> and end with </html>. Output NOTHING else.`;

    const response = await callWithFallback(prompt, { temperature: 0.2 });

    let htmlContent = response.text || '';
    
    // Strip markdown code fences if present
    const fenceMatch = htmlContent.match(/```(?:html)?\s*\n([\s\S]*?)```/);
    if (fenceMatch) {
      htmlContent = fenceMatch[1].trim();
    }
    
    // Extract from <!DOCTYPE html> if there's preamble text
    const doctypeIndex = htmlContent.indexOf('<!DOCTYPE html>');
    if (doctypeIndex > 0) {
      htmlContent = htmlContent.slice(doctypeIndex);
    }
    
    // Trim anything after </html>
    const htmlEndIndex = htmlContent.lastIndexOf('</html>');
    if (htmlEndIndex !== -1) {
      htmlContent = htmlContent.slice(0, htmlEndIndex + '</html>'.length);
    }

    if (!htmlContent.includes('<!DOCTYPE html>')) {
      return NextResponse.json({ error: 'LLM did not return valid HTML' }, { status: 500 });
    }

    return NextResponse.json({ html: htmlContent });
  } catch (error: any) {
    console.error('Error generating app:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate application' }, { status: 500 });
  }
}
