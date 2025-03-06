import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';

  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    return NextResponse.redirect(
      new URL(`/auth/signup?error=MissingFields&callbackUrl=${callbackUrl}`, request.url)
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.redirect(
      new URL(`/auth/signup?error=PasswordMismatch&callbackUrl=${callbackUrl}`, request.url)
    );
  }

  try {
    const supabase = await createServerClient();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      console.error('Sign-up error:', error.message);
      return NextResponse.redirect(
        new URL(`/auth/signup?error=EmailCreateAccount&callbackUrl=${callbackUrl}`, request.url)
      );
    }

    // Create a user profile in the profiles table
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          full_name: `${firstName} ${lastName}`,
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError.message);
      }
    }

    // For email confirmation flow, redirect to verification page
    if (data?.user?.identities?.length === 0) {
      return NextResponse.redirect(
        new URL(`/auth/verify-email?email=${encodeURIComponent(email)}`, request.url)
      );
    }

    // Direct sign-in case (if email verification is disabled)
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    console.error('Unexpected error during sign-up:', error);
    return NextResponse.redirect(
      new URL(`/auth/signup?error=UnexpectedError&callbackUrl=${callbackUrl}`, request.url)
    );
  }
} 