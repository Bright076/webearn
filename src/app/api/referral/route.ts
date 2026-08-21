import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  encodeReferralData,
  decodeReferralData,
  hashIP,
  getReferralCookieOptions,
  COOKIE_NAME,
} from "@/lib/referral";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productSlug = searchParams.get("product");
  const affiliateCode = searchParams.get("ref");

  // If no referral params, just redirect to get-a-website
  if (!productSlug || !affiliateCode) {
    return NextResponse.redirect(new URL("/get-a-website", request.url));
  }

  const adminClient = createAdminClient();

  // Look up product by slug
  const { data: product } = await adminClient
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .single();

  // Look up affiliate by code
  const { data: profile } = await adminClient
    .from("profiles")
    .select("id")
    .eq("affiliate_code", affiliateCode)
    .single();

  // If either doesn't exist, silently redirect without attribution
  if (!product || !profile) {
    return NextResponse.redirect(new URL("/get-a-website", request.url));
  }

  // Check if referral cookie already exists
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(COOKIE_NAME);

  let shouldSetCookie = true;

  if (existingCookie) {
    // Decode existing cookie
    const existingData = decodeReferralData(existingCookie.value);

    // If valid cookie exists, DO NOT overwrite (first-touch attribution)
    if (existingData) {
      shouldSetCookie = false;
    }
    // If invalid/expired, we'll set a new one
  }

  // Log the click
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  await adminClient.from("referral_clicks").insert({
    affiliate_id: profile.id,
    product_id: product.id,
    ip_hash: hashIP(ip),
    user_agent: userAgent,
  });

  // Create response with redirect
  const response = NextResponse.redirect(new URL("/get-a-website", request.url));

  // Set cookie only if no valid cookie exists (first-touch)
  if (shouldSetCookie) {
    const referralData = {
      affiliate_id: profile.id,
      product_id: product.id,
      captured_at: new Date().toISOString(),
    };

    const encodedData = encodeReferralData(referralData);
    const cookieOptions = getReferralCookieOptions();

    response.cookies.set(COOKIE_NAME, encodedData, cookieOptions);
  }

  return response;
}
