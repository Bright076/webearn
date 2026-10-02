import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { decodeReferralData, COOKIE_NAME } from "@/lib/referral";
import { z } from "zod";

// Force Node.js runtime for proper cookie handling
export const runtime = 'nodejs';

const requestSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  whatsappNumber: z.string().min(10, "Valid WhatsApp number is required"),
  email: z.string().email().optional().or(z.literal("")),
  businessName: z.string().optional(),
  websiteType: z.string().min(1, "Website type is required"),
  budget: z.string().min(1, "Budget is required"),
  projectDescription: z.string().optional(),
  // Referral data passed from form (prefixed with _ to indicate internal)
  _affiliateId: z.string().uuid().optional().nullable(),
  _productId: z.string().uuid().optional().nullable(),
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

    // Get referral data from request body (passed from form via URL params)
    console.log("\n--- REFERRAL DATA FROM FORM ---");
    let affiliateId: string | null = formData._affiliateId || null;
    let productId: string | null = formData._productId || null;
    
    console.log("Affiliate ID from form:", affiliateId);
    console.log("Product ID from form:", productId);
    
    if (affiliateId && productId) {
      console.log("✓ Referral data found in form submission!");
    } else {
      console.log("ℹ️  No referral data - this is a DIRECT request");
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

    // Return success response
    const response = NextResponse.json({
      success: true,
      message: "Request submitted successfully",
      requestId: data.id,
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
