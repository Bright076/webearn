import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { decodeReferralData, COOKIE_NAME } from "@/lib/referral";
import { z } from "zod";

const requestSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  whatsappNumber: z.string().min(10, "Valid WhatsApp number is required"),
  email: z.string().email().optional().or(z.literal("")),
  businessName: z.string().optional(),
  websiteType: z.string().min(1, "Website type is required"),
  budget: z.string().min(1, "Budget is required"),
  projectDescription: z.string().optional(),
});

export async function POST(request: NextRequest) {
  console.log("\n========================================");
  console.log("=== API /api/requests CALLED ===");
  console.log("========================================");
  
  try {
    const body = await request.json();
    console.log("✓ Request body received:", JSON.stringify(body, null, 2));

    // Validate form data
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("❌ VALIDATION FAILED:");
      console.error(JSON.stringify(validationResult.error.issues, null, 2));
      return NextResponse.json(
        { error: "Invalid form data", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const formData = validationResult.data;
    console.log("✓ Form data validated successfully");

    // Read referral cookie SERVER-SIDE ONLY
    // NEVER trust client-submitted affiliate_id/product_id
    console.log("\n--- COOKIE DETECTION ---");
    console.log("Looking for cookie:", COOKIE_NAME);
    
    const cookieHeader = request.cookies.get(COOKIE_NAME);
    console.log("Cookie object:", cookieHeader);
    
    let affiliateId: string | null = null;
    let productId: string | null = null;

    if (cookieHeader) {
      console.log("✓ Cookie found!");
      console.log("Cookie value (encoded):", cookieHeader.value);
      
      const referralData = decodeReferralData(cookieHeader.value);
      console.log("Decoded referral data:", JSON.stringify(referralData, null, 2));
      
      if (referralData) {
        affiliateId = referralData.affiliate_id;
        productId = referralData.product_id;
        console.log("✓ Successfully extracted referral data:");
        console.log("  - Affiliate ID:", affiliateId);
        console.log("  - Product ID:", productId);
        console.log("  - Captured at:", referralData.captured_at);
      } else {
        console.log("❌ Failed to decode referral data (invalid/expired/tampered)");
      }
    } else {
      console.log("ℹ️  No referral cookie found - this is a DIRECT request (not from affiliate link)");
    }

    // Insert request into database
    console.log("\n--- DATABASE INSERT ---");
    const adminClient = createAdminClient();

    const insertData = {
      full_name: formData.fullName,
      whatsapp_number: formData.whatsappNumber,
      email: formData.email || null,
      business_name: formData.businessName || null,
      website_type: formData.websiteType,
      budget: formData.budget,
      project_description: formData.projectDescription || null,
      affiliate_id: affiliateId,
      product_id: productId,
      status: "pending",
    };

    console.log("Data to insert:", JSON.stringify(insertData, null, 2));

    const { data, error } = await adminClient
      .from("client_requests")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ DATABASE ERROR:");
      console.error({
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        { error: "Failed to submit request", details: error.message },
        { status: 500 }
      );
    }

    console.log("✓ Successfully inserted request!");
    console.log("Request ID:", data.id);
    console.log("Affiliate ID in DB:", data.affiliate_id || "NULL (Direct)");
    console.log("Product ID in DB:", data.product_id || "NULL");
    console.log("========================================\n");

    // Optional: Clear referral cookie after successful submission
    // This prevents the same click from being attributed to multiple requests
    const response = NextResponse.json({
      success: true,
      message: "Request submitted successfully",
      requestId: data.id,
    });

    // Clear the cookie
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ UNEXPECTED ERROR:");
    console.error(error);
    console.error("========================================\n");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
