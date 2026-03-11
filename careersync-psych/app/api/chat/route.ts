import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),  // ← model name
      system: `Act as an IT and CS career advisor. When given a student profile, respond ONLY with a valid JSON object (no markdown, no prose).
JSON Structure:
{
  "role": "Specific job title",
  "summary": "1-sentence role description",
  "fitReason": "1-sentence connecting profile to role",
  "confidence": 0-100
}`,
      prompt,
    });

    const clean = text.replace(/```json|```/g, '').trim();

    return new Response(clean, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/chat] Error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}