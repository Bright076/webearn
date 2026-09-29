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

// Force Node.js runtime for proper cookie handling
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log("\n========================================");
  console.log("=== API /api/referral CALLED ===");
  console.log("========================================");
  
  const searchParams = request.nextUrl.searchParams;
  const productSlug = searchParams.get("product");
  const affiliateCode = searchParams.get("ref");

  console.log("Query params:");
  console.log("  - product:", productSlug || "MISSING");
  console.log("  - ref:", affiliateCode || "MISSING");

  // If no referral params, just redirect to get-a-website
  if (!productSlug || !affiliateCode) {
    console.log("❌ Missing referral parameters - redirecting without tracking");
    console.log("========================================\n");
    return NextResponse.redirect(new URL("/get-a-website", request.url));
  }

  const adminClient = createAdminClient();

  // Look up product by slug
  console.log("\n--- PRODUCT LOOKUP ---");
  console.log("Looking for product with slug:", productSlug);
  const { data: product, error: productError } = await adminClient
    .from("products")
    .select("id")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .single();

  if (productError) {
    console.log("❌ Product lookup error:", productError.message);
  }
  if (!product) {
    console.log("❌ Product not found or inactive");
    console.log("========================================\n");
    return NextResponse.redirect(new URL("/get-a-website", request.url));
  }
  console.log("✓ Product found! ID:", product.id);

  // Look up affiliate by code
  console.log("\n--- AFFILIATE LOOKUP ---");
  console.log("Looking for affiliate with code:", affiliateCode);
  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("id")
    .eq("affiliate_code", affiliateCode)
    .single();

  if (profileError) {
    console.log("❌ Affiliate lookup error:", profileError.message);
  }
  if (!profile) {
    console.log("❌ Affiliate not found");
    console.log("========================================\n");
    return NextResponse.redirect(new URL("/get-a-website", request.url));
  }
  console.log("✓ Affiliate found! ID:", profile.id);

  // Check if referral cookie already exists
  console.log("\n--- COOKIE CHECK ---");
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(COOKIE_NAME);

  let shouldSetCookie = true;

  if (existingCookie) {
    console.log("ℹ️  Existing cookie found");
    // Decode existing cookie
    const existingData = decodeReferralData(existingCookie.value);

    // If valid cookie exists, DO NOT overwrite (first-touch attribution)
    if (existingData) {
      console.log("✓ Existing cookie is valid - keeping first-touch attribution");
      console.log("  - Original affiliate:", existingData.affiliate_id);
      console.log("  - Original product:", existingData.product_id);
      console.log("  - Captured at:", existingData.captured_at);
      shouldSetCookie = false;
    } else {
      console.log("ℹ️  Existing cookie is invalid/expired - will set new cookie");
    }
  } else {
    console.log("ℹ️  No existing cookie - will set new cookie");
  }

  // Log the click
  console.log("\n--- LOGGING CLICK ---");
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  console.log("IP:", ip);
  console.log("User Agent:", userAgent.substring(0, 50) + "...");

  const { error: clickError } = await adminClient.from("referral_clicks").insert({
    affiliate_id: profile.id,
    product_id: product.id,
    ip_hash: hashIP(ip),
    user_agent: userAgent,
  });

  if (clickError) {
    console.log("❌ Failed to log click:", clickError.message);
  } else {
    console.log("✓ Click logged successfully");
  }

  // Create response with redirect
  const response = NextResponse.redirect(new URL("/get-a-website", request.url));

  // Set cookie only if no valid cookie exists (first-touch)
  if (shouldSetCookie) {
    console.log("\n--- SETTING COOKIE ---");
    const referralData = {
      affiliate_id: profile.id,
      product_id: product.id,
      captured_at: new Date().toISOString(),
    };

    console.log("Referral data:", JSON.stringify(referralData, null, 2));

    const encodedData = encodeReferralData(referralData);
    const cookieOptions = getReferralCookieOptions();

    console.log("Cookie name:", COOKIE_NAME);
    console.log("Cookie options:", cookieOptions);
    console.log("Encoded data (first 50 chars):", encodedData.substring(0, 50) + "...");

    response.cookies.set(COOKIE_NAME, encodedData, cookieOptions);
    console.log("✓ Cookie set successfully!");
  }

  console.log("\n✓ Redirecting to /get-a-website");
  console.log("========================================\n");

  return response;
}
