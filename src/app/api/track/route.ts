import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashIP } from "@/lib/referral";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageUrl, referrer } = body;

    // Get visitor info
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    // Determine device type from user agent
    const ua = userAgent.toLowerCase();
    let deviceType = "desktop";
    if (/mobile|android|iphone|ipad|tablet/.test(ua)) {
      if (/tablet|ipad/.test(ua)) {
        deviceType = "tablet";
      } else {
        deviceType = "mobile";
      }
    }

    // Get country from Vercel headers (if available)
    const country = request.headers.get("x-vercel-ip-country") || null;

    const adminClient = createAdminClient();

    // Insert page view
    await adminClient.from("page_views").insert({
      page_url: pageUrl,
      referrer: referrer || null,
      ip_hash: hashIP(ip),
      user_agent: userAgent,
      country: country,
      device_type: deviceType,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    // Return success anyway to not break the page
    return NextResponse.json({ success: true });
  }
}
