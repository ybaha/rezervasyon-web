import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error('Error updating password:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    console.error('Error in update password route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 