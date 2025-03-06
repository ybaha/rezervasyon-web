import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let callbackUrl = "/";
    
    // Check if the request includes form data
    const contentType = request.headers.get("content-type");
    if (contentType && contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      callbackUrl = formData.get("callbackUrl") as string || "/";
    } else {
      // If not form data, check search params
      const requestUrl = new URL(request.url);
      callbackUrl = requestUrl.searchParams.get("callbackUrl") || "/";
    }
    
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
} 