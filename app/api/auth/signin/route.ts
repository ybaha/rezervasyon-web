import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';

  if (!email || !password) {
    return NextResponse.redirect(
      new URL(`/auth/signin?error=InvalidCredentials&callbackUrl=${callbackUrl}`, request.url)
    );
  }

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign-in error:', error.message);
      return NextResponse.redirect(
        new URL(`/auth/signin?error=CredentialsSignin&callbackUrl=${callbackUrl}`, request.url)
      );
    }

    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    console.error('Unexpected error during sign-in:', error);
    return NextResponse.redirect(
      new URL(`/auth/signin?error=UnexpectedError&callbackUrl=${callbackUrl}`, request.url)
    );
  }
} 