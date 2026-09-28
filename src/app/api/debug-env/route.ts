import { NextResponse } from "next/server";

// TEMPORARY DEBUG ENDPOINT - DELETE AFTER TESTING!
export async function GET() {
  return NextResponse.json({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasCookieSecret: !!process.env.REFERRAL_COOKIE_SECRET,
    cookieSecretLength: process.env.REFERRAL_COOKIE_SECRET?.length || 0,
    nodeEnv: process.env.NODE_ENV,
  });
}
