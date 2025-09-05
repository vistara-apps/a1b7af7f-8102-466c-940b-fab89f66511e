import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const language = searchParams.get('language') || 'en';
    const type = searchParams.get('type');
    const isPremium = searchParams.get('isPremium');

    let query = supabase
      .from('legal_guides')
      .select('*')
      .eq('language', language);

    if (state) {
      query = query.eq('state', state);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (isPremium !== null) {
      query = query.eq('is_premium', isPremium === 'true');
    }

    const { data: guides, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching legal guides:', error);
      return NextResponse.json(
        { error: 'Failed to fetch legal guides' },
        { status: 500 }
      );
    }

    // Transform database format to frontend format
    const transformedGuides = guides.map(guide => ({
      guideId: guide.id,
      title: guide.title,
      content: guide.content,
      state: guide.state,
      language: guide.language,
      type: guide.type,
      isPremium: guide.is_premium
    }));

    return NextResponse.json({ guides: transformedGuides });

  } catch (error) {
    console.error('Legal guides API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, state, language = 'en', type, isPremium = false } = body;

    if (!title || !content || !state || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: newGuide, error } = await supabase
      .from('legal_guides')
      .insert({
        title,
        content,
        state,
        language,
        type,
        is_premium: isPremium
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating legal guide:', error);
      return NextResponse.json(
        { error: 'Failed to create legal guide' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      guide: {
        guideId: newGuide.id,
        title: newGuide.title,
        content: newGuide.content,
        state: newGuide.state,
        language: newGuide.language,
        type: newGuide.type,
        isPremium: newGuide.is_premium
      }
    });

  } catch (error) {
    console.error('Create legal guide error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
