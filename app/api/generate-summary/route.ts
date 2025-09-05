import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { timestamp, location, duration } = body;

    const prompt = `Generate a concise summary for a police encounter record with the following details:
    - Date/Time: ${new Date(timestamp).toLocaleString()}
    - Location: ${location.city || 'Unknown'}, ${location.state || 'Unknown'}
    - Coordinates: ${location.latitude}, ${location.longitude}
    - Duration: ${duration ? Math.floor(duration / 60) : 'Unknown'} minutes
    
    Create a professional, factual summary that could be useful for legal documentation. Keep it under 200 words and focus on the key details that would be important for legal purposes.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal documentation assistant. Generate clear, factual summaries for police encounter records.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content || 'Unable to generate summary';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
