"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function toggleAffiliateStatus(
  affiliateId: string,
  newStatus: string
) {
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

    // Update affiliate status
    const { error } = await adminClient
      .from("profiles")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", affiliateId);

    if (error) {
      console.error("Error updating affiliate status:", error);
      return { error: "Failed to update affiliate status" };
    }

    // Log activity
    await adminClient.from("activity_log").insert({
      actor_id: user.id,
      action: "affiliate_status_changed",
      entity_type: "profile",
      entity_id: affiliateId,
      details: { new_status: newStatus },
    });

    revalidatePath("/admin/affiliates");
    return { success: true };
  } catch (error) {
    console.error("Error in toggleAffiliateStatus:", error);
    return { error: "An error occurred" };
  }
}
