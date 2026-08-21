"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function approveWithdrawal(withdrawalId: string) {
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

    // Approve withdrawal
    const { error } = await adminClient
      .from("withdrawals")
      .update({
        status: "approved",
      })
      .eq("id", withdrawalId);

    if (error) {
      console.error("Error approving withdrawal:", error);
      return { error: "Failed to approve withdrawal" };
    }

    // Log activity
    await adminClient.from("activity_log").insert({
      actor_id: user.id,
      action: "withdrawal_status_changed",
      entity_type: "withdrawal",
      entity_id: withdrawalId,
      details: { from: "pending", to: "approved" },
    });

    revalidatePath("/admin/withdrawals");
    return { success: true };
  } catch (error) {
    console.error("Error in approveWithdrawal:", error);
    return { error: "An error occurred" };
  }
}

export async function markWithdrawalPaid(withdrawalId: string) {
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

    // Mark as paid
    const { error } = await adminClient
      .from("withdrawals")
      .update({
        status: "paid",
        processed_by: user.id,
        processed_at: new Date().toISOString(),
      })
      .eq("id", withdrawalId);

    if (error) {
      console.error("Error marking withdrawal as paid:", error);
      return { error: "Failed to mark withdrawal as paid" };
    }

    // Log activity
    await adminClient.from("activity_log").insert({
      actor_id: user.id,
      action: "withdrawal_status_changed",
      entity_type: "withdrawal",
      entity_id: withdrawalId,
      details: { from: "approved", to: "paid" },
    });

    revalidatePath("/admin/withdrawals");
    return { success: true };
  } catch (error) {
    console.error("Error in markWithdrawalPaid:", error);
    return { error: "An error occurred" };
  }
}

export async function rejectWithdrawal(withdrawalId: string, reason: string) {
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

    // Reject withdrawal
    const { error } = await adminClient
      .from("withdrawals")
      .update({
        status: "rejected",
        rejection_reason: reason,
      })
      .eq("id", withdrawalId);

    if (error) {
      console.error("Error rejecting withdrawal:", error);
      return { error: "Failed to reject withdrawal" };
    }

    // Log activity
    await adminClient.from("activity_log").insert({
      actor_id: user.id,
      action: "withdrawal_status_changed",
      entity_type: "withdrawal",
      entity_id: withdrawalId,
      details: { to: "rejected", reason },
    });

    revalidatePath("/admin/withdrawals");
    return { success: true };
  } catch (error) {
    console.error("Error in rejectWithdrawal:", error);
    return { error: "An error occurred" };
  }
}
