import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { dbHelpers } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
});

interface ScriptRequest {
  state: string;
  language: 'en' | 'es';
  scenario: 'traffic' | 'search' | 'arrest' | 'general';
  userIsPremium: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScriptRequest = await request.json();
    const { state, language, scenario, userIsPremium } = body;

    // Validate required fields
    if (!state || !language || !scenario) {
      return NextResponse.json(
        { error: 'Missing required fields: state, language, and scenario' },
        { status: 400 }
      );
    }

    // Check if premium feature is being accessed
    if (!userIsPremium && scenario !== 'general') {
      return NextResponse.json(
        { 
          error: 'Premium subscription required',
          message: 'State-specific scripts require a premium subscription. Upgrade to access this feature.',
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    // Create scenario-specific prompts
    const scenarioPrompts = {
      traffic: `Generate a comprehensive script for a traffic stop encounter in ${state}. Include:
        1. What to say when pulled over
        2. How to respond to requests for documents
        3. How to handle search requests
        4. What NOT to say or do
        5. State-specific laws and rights`,
      
      search: `Generate a script for handling search and seizure situations in ${state}. Include:
        1. How to clearly refuse consent to search
        2. What to say if police claim probable cause
        3. How to document the interaction
        4. State-specific Fourth Amendment protections
        5. What to do if searched anyway`,
      
      arrest: `Generate a script for arrest situations in ${state}. Include:
        1. How to invoke right to remain silent
        2. How to request an attorney
        3. What information you must provide
        4. How to behave during arrest
        5. State-specific arrest procedures and rights`,
      
      general: `Generate a general rights script for police encounters in ${state}. Include:
        1. Basic constitutional rights
        2. How to remain calm and respectful
        3. What you must vs. don't have to do
        4. How to document the encounter
        5. General de-escalation techniques`
    };

    const languageInstructions = language === 'es' 
      ? 'Provide the response in Spanish. Use clear, simple language that would be understood under stress.'
      : 'Provide the response in English. Use clear, simple language that would be understood under stress.';

    const prompt = `${scenarioPrompts[scenario]}

    ${languageInstructions}

    Format the response as a practical, easy-to-follow script with:
    - Clear "SAY THIS" and "DON'T SAY THIS" sections
    - Step-by-step instructions
    - Key phrases to remember
    - Emergency contact reminders

    Keep it concise but comprehensive, focusing on practical advice that can be quickly referenced during a stressful encounter.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_API_KEY ? 'google/gemini-2.0-flash-001' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a legal rights educator specializing in police encounter guidance. Generate practical, legally accurate scripts that help people exercise their constitutional rights safely and effectively. Focus on de-escalation and legal compliance. Always emphasize remaining calm and respectful while asserting rights.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.1,
    });

    const script = completion.choices[0]?.message?.content || 'Unable to generate script';

    // Try to save the generated script to the database for future use
    try {
      await dbHelpers.createLegalGuide({
        guide_id: `${state}-${scenario}-${language}-${Date.now()}`,
        title: `${scenario.charAt(0).toUpperCase() + scenario.slice(1)} Script - ${state}`,
        content: script,
        state,
        language,
        type: scenario === 'general' ? 'basic' : scenario,
        is_premium: scenario !== 'general',
      });
    } catch (dbError) {
      console.error('Error saving script to database:', dbError);
      // Continue with response even if DB save fails
    }

    return NextResponse.json({
      script,
      state,
      language,
      scenario,
      timestamp: new Date().toISOString(),
      isPremium: scenario !== 'general'
    });

  } catch (error) {
    console.error('Error generating script:', error);
    
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
          { error: 'Service temporarily unavailable. Please try again in a moment.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate script. Please try again.' },
      { status: 500 }
    );
  }
}
