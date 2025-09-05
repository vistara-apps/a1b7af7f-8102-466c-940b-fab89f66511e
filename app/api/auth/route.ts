import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, preferredLanguage = 'en' } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    if (existingUser) {
      // User exists, return existing user
      return NextResponse.json({
        user: {
          userId: existingUser.id,
          walletAddress: existingUser.wallet_address,
          subscriptionStatus: existingUser.subscription_status,
          preferredLanguage: existingUser.preferred_language,
          savedStateLaws: existingUser.saved_state_laws
        }
      });
    }

    // Create new user
    const newUserId = uuidv4();
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: newUserId,
        wallet_address: walletAddress,
        subscription_status: 'free',
        preferred_language: preferredLanguage,
        saved_state_laws: []
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: {
        userId: newUser.id,
        walletAddress: newUser.wallet_address,
        subscriptionStatus: newUser.subscription_status,
        preferredLanguage: newUser.preferred_language,
        savedStateLaws: newUser.saved_state_laws
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: {
        userId: updatedUser.id,
        walletAddress: updatedUser.wallet_address,
        subscriptionStatus: updatedUser.subscription_status,
        preferredLanguage: updatedUser.preferred_language,
        savedStateLaws: updatedUser.saved_state_laws
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
