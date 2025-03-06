import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  
  if (code) {
    const supabase = await createServerClient();
    
    // Try to exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redirect to the specified next URL or dashboard
    return NextResponse.redirect(new URL(next, request.url));
  }
  
  // If no code is present, redirect to home
  return NextResponse.redirect(new URL('/', request.url));
} 