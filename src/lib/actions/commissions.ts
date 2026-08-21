"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function approveCommission(commissionId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    // Check if user is admin
    const adminClient = createAdminClient();
    const { data: userRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (userRole?.role !== "admin") {
      return { error: "Unauthorized: Admin access required" };
    }

    // Get commission details
    const { data: commission } = await adminClient
      .from("commissions")
      .select("request_id")
      .eq("id", commissionId)
      .single();

    if (!commission) {
      return { error: "Commission not found" };
    }

    // Verify request is paid (safety check)
    const { data: request } = await adminClient
      .from("client_requests")
      .select("status")
      .eq("id", commission.request_id)
      .single();

    if (request?.status !== "paid") {
      return { error: "Cannot approve: associated request is not marked as paid" };
    }

    // Approve commission
    const { error } = await adminClient
      .from("commissions")
      .update({
        status: "approved",
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", commissionId);

    if (error) {
      console.error("Error approving commission:", error);
      return { error: "Failed to approve commission" };
    }

    // Log activity
    await adminClient.from("activity_log").insert({
      actor_id: user.id,
      action: "commission_approved",
      entity_type: "commission",
      entity_id: commissionId,
      details: {},
    });

    revalidatePath("/admin/commissions");
    return { success: true };
  } catch (error) {
    console.error("Error in approveCommission:", error);
    return { error: "An error occurred" };
  }
}

export async function rejectCommission(commissionId: string, reason: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    // Check if user is admin
    const adminClient = createAdminClient();
    const { data: userRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (userRole?.role !== "admin") {
      return { error: "Unauthorized: Admin access required" };
    }

    if (!reason.trim()) {
      return { error: "Rejection reason is required" };
    }

    // Reject commission
    const { error } = await adminClient
      .from("commissions")
      .update({
        status: "rejected",
        rejection_reason: reason,
      })
      .eq("id", commissionId);

    if (error) {
      console.error("Error rejecting commission:", error);
      return { error: "Failed to reject commission" };
    }

    // Log activity
    await adminClient.from("activity_log").insert({
      actor_id: user.id,
      action: "commission_rejected",
      entity_type: "commission",
      entity_id: commissionId,
      details: { reason },
    });

    revalidatePath("/admin/commissions");
    return { success: true };
  } catch (error) {
    console.error("Error in rejectCommission:", error);
    return { error: "An error occurred" };
  }
}
