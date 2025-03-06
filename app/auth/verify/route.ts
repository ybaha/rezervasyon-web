import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');
  const type = requestUrl.searchParams.get('type') || 'email_verification';
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin?error=MissingToken', request.url));
  }
  
  try {
    const supabase = await createServerClient();
    
    // Verify the user's email
    if (type === 'email_verification') {
      await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      
      return NextResponse.redirect(new URL('/auth/signin?success=EmailVerified', request.url));
    }
    
    // Handle recovery (reset password)
    if (type === 'recovery') {
      return NextResponse.redirect(new URL(`/auth/reset-password?token=${token}`, request.url));
    }
    
    // Default fallback
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/auth/signin?error=VerificationError', request.url));
  }
} 