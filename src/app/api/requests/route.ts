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
  try {
    const body = await request.json();

    // Validate form data
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Read referral cookie SERVER-SIDE ONLY
    // NEVER trust client-submitted affiliate_id/product_id
    const cookieHeader = request.cookies.get(COOKIE_NAME);
    let affiliateId: string | null = null;
    let productId: string | null = null;

    if (cookieHeader) {
      const referralData = decodeReferralData(cookieHeader.value);
      if (referralData) {
        affiliateId = referralData.affiliate_id;
        productId = referralData.product_id;
      }
    }

    // Insert request into database
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from("client_requests")
      .insert({
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
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating client request:", error);
      return NextResponse.json(
        { error: "Failed to submit request" },
        { status: 500 }
      );
    }

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
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
