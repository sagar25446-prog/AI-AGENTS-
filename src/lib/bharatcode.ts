// ============================================================
// BharatCode Model API Client (OpenAI-compatible)
// Event: BharatCode Build League 2026
// Base URL: https://bharatcode.ai/api/model/v1
// Supported Models: qwen-3.8-27b, deepseek-v4.1-flash
// ============================================================

export interface BharatCodeMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface BharatCodeOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

export async function callBharatCode(
  messages: BharatCodeMessage[],
  options: BharatCodeOptions = {}
): Promise<string> {
  const apiKey = process.env.BHARATCODE_API_KEY;
  const baseUrl = (process.env.BHARATCODE_BASE_URL || 'https://bharatcode.ai/api/model/v1').replace(/\/$/, '');

  if (!apiKey) {
    throw new Error('BHARATCODE_API_KEY environment variable is not configured');
  }

  // Default to standard access tier model Qwen 3.8 27B, fallback to env variable if specified
  const model = options.model || process.env.BHARATCODE_MODEL || 'qwen-3.8-27b';

  console.log(`[BharatCode] Sending request to ${baseUrl}/chat/completions using model: ${model}`);

  const payload: Record<string, any> = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 2500,
  };

  if (options.response_format) {
    payload.response_format = options.response_format;
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[BharatCode] API Error (${response.status}):`, errorBody);
    throw new Error(`BharatCode API returned ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  
  if (!content) {
    throw new Error('Empty response from BharatCode API');
  }

  return content;
}
