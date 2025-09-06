import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { dbHelpers } from '@/lib/supabase';

const createOpenAIClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OpenAI API key is required. Please set OPENAI_API_KEY or OPENROUTER_API_KEY environment variable.'
    );
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENROUTER_API_KEY
      ? 'https://openrouter.ai/api/v1'
      : undefined,
  });
};

export async function POST(request: NextRequest) {
  try {
    const openai = createOpenAIClient();
    const body = await request.json();
    const {
      encounterId,
      timestamp,
      location,
      duration,
      userId,
      additionalNotes,
    } = body;

    // Validate required fields
    if (!timestamp || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: timestamp and location' },
        { status: 400 }
      );
    }

    const prompt = `Generate a comprehensive legal summary for a police encounter record with the following details:
    - Date/Time: ${new Date(timestamp).toLocaleString()}
    - Location: ${location.city || 'Unknown'}, ${location.state || 'Unknown'}
    - Coordinates: ${location.latitude}, ${location.longitude}
    - Duration: ${duration ? Math.floor(duration / 60) : 'Unknown'} minutes
    ${additionalNotes ? `- Additional Notes: ${additionalNotes}` : ''}
    
    Create a professional, factual summary that could be useful for legal documentation. Include:
    1. Basic encounter details (date, time, location)
    2. Duration and circumstances
    3. Key legal considerations
    4. Recommended next steps if applicable
    
    Keep it under 300 words and focus on factual information that would be important for legal purposes.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY
        ? 'google/gemini-2.0-flash-001'
        : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a legal documentation assistant specializing in police encounter records. Generate clear, factual, and legally relevant summaries that could be used in legal proceedings. Focus on objective facts and avoid speculation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.2,
    });

    const summary =
      completion.choices[0]?.message?.content || 'Unable to generate summary';

    // If encounterId is provided, update the encounter in the database
    if (encounterId && userId) {
      try {
        await dbHelpers.updateEncounter(encounterId, { summary });
      } catch (dbError) {
        console.error('Error updating encounter in database:', dbError);
        // Continue with response even if DB update fails
      }
    }

    return NextResponse.json({
      summary,
      timestamp: new Date().toISOString(),
      encounterId,
    });
  } catch (error) {
    console.error('Error generating summary:', error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please contact support.' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          {
            error:
              'Service temporarily unavailable. Please try again in a moment.',
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}
