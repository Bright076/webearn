"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(
  requestId: string,
  newStatus: string,
  previousStatus: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userRole?.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  // Update request status
  const { error } = await adminClient
    .from("client_requests")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    return { error: error.message };
  }

  // If status changed to 'paid', create commission if it doesn't exist
  if (newStatus === "paid" && previousStatus !== "paid") {
    const { data: request } = await adminClient
      .from("client_requests")
      .select("affiliate_id, product_id")
      .eq("id", requestId)
      .single();

    if (request?.affiliate_id && request?.product_id) {
      // Check if commission already exists
      const { data: existingCommission } = await adminClient
        .from("commissions")
        .select("id")
        .eq("client_request_id", requestId)
        .single();

      if (!existingCommission) {
        // Fetch product to get commission details
        const { data: product } = await adminClient
          .from("products")
          .select("commission_type, commission_value, price")
          .eq("id", request.product_id)
          .single();

        if (product) {
          // Calculate commission amount
          let commissionAmount = 0;
          if (product.commission_type === "fixed") {
            commissionAmount = Number(product.commission_value);
          } else {
            // percentage
            commissionAmount = (Number(product.price) * Number(product.commission_value)) / 100;
          }

          // Create commission
          const { error: commissionError } = await adminClient.from("commissions").insert({
            affiliate_id: request.affiliate_id,
            client_request_id: requestId,
            product_id: request.product_id,
            amount: commissionAmount,
            status: "pending",
          });

          if (commissionError) {
            console.error("Failed to create commission:", commissionError);
          } else {
            // Fetch affiliate code for response
            const { data: affiliate } = await adminClient
              .from("profiles")
              .select("affiliate_code")
              .eq("id", request.affiliate_id)
              .single();

            revalidatePath("/admin/commissions");
            revalidatePath("/dashboard/earnings");

            return {
              success: true,
              commissionCreated: true,
              affiliateCode: affiliate?.affiliate_code,
            };
          }
        }
      } else {
        return { success: true, commissionExists: true };
      }
    } else {
      return { success: true, noAffiliate: true };
    }
  }

  revalidatePath("/admin/requests");
  revalidatePath("/dashboard/leads");

  return { success: true };
}

export async function updateRequestNotes(requestId: string, notes: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userRole?.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  const { error } = await adminClient
    .from("client_requests")
    .update({
      admin_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/requests");

  return { success: true };
}
