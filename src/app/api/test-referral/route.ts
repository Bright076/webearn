import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { COOKIE_NAME } from "@/lib/referral";

// TEMPORARY TEST ENDPOINT - DELETE AFTER DEBUGGING!
export async function GET(request: NextRequest) {
  const adminClient = createAdminClient();
  
  // Check if we can query database
  const { data: products, error: productsError } = await adminClient
    .from("products")
    .select("id, name, slug")
    .limit(1);
  
  const { data: profiles, error: profilesError } = await adminClient
    .from("profiles")
    .select("id, affiliate_code")
    .limit(1);
  
  // Check cookies
  const allCookies = request.cookies.getAll();
  const referralCookie = request.cookies.get(COOKIE_NAME);
  
  return NextResponse.json({
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasCookieSecret: !!process.env.REFERRAL_COOKIE_SECRET,
      cookieSecretLength: process.env.REFERRAL_COOKIE_SECRET?.length || 0,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    },
    database: {
      canQueryProducts: !productsError,
      productsError: productsError?.message || null,
      productCount: products?.length || 0,
      firstProduct: products?.[0] || null,
      canQueryProfiles: !profilesError,
      profilesError: profilesError?.message || null,
      profileCount: profiles?.length || 0,
      firstProfile: profiles?.[0] || null,
    },
    cookies: {
      cookieName: COOKIE_NAME,
      hasReferralCookie: !!referralCookie,
      referralCookieValue: referralCookie?.value ? referralCookie.value.substring(0, 20) + "..." : null,
      allCookiesCount: allCookies.length,
      allCookieNames: allCookies.map(c => c.name),
    },
    request: {
      url: request.url,
      method: request.method,
      headers: {
        userAgent: request.headers.get("user-agent")?.substring(0, 50) + "...",
        host: request.headers.get("host"),
        forwarded: request.headers.get("x-forwarded-for"),
      },
    },
  });
}
