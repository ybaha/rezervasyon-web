import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const callbackUrl = formData.get('callbackUrl') as string || '/auth/signin';

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.nextUrl.origin}/auth/verify?type=recovery&next=${encodeURIComponent(callbackUrl)}`,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL(`/auth/reset-password/confirmation?email=${encodeURIComponent(email)}`, request.url)
    );
  } catch (error) {
    console.error('Error in reset password route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 