import { createServerClient } from '@/lib/supabase-server';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request: NextRequest
) {
  // Create a Supabase client configured to use cookies
  const supabase = await createServerClient();

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  return NextResponse.next();
}

// Specify the paths that should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 