import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;
  const requestUrl = new URL(request.url);
  const callbackUrl = requestUrl.searchParams.get('callbackUrl') || '/dashboard';

  // Validate the provider
  const validProviders = ['google', 'github', 'apple'];
  if (!validProviders.includes(provider)) {
    return NextResponse.redirect(
      new URL(`/auth/signin?error=InvalidProvider&callbackUrl=${callbackUrl}`, request.url)
    );
  }

  try {
    const supabase = await createServerClient();
    
    // Generate the OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'github' | 'apple',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${callbackUrl}`,
      },
    });

    if (error || !data.url) {
      console.error('OAuth error:', error?.message);
      return NextResponse.redirect(
        new URL(`/auth/signin?error=OAuthError&callbackUrl=${callbackUrl}`, request.url)
      );
    }

    // Redirect to the provider's authorization URL
    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error('Unexpected error during OAuth:', error);
    return NextResponse.redirect(
      new URL(`/auth/signin?error=UnexpectedError&callbackUrl=${callbackUrl}`, request.url)
    );
  }
} 