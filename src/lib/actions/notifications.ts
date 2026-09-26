"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

interface NotificationData {
  recipientIds: string[];
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  link?: string;
}

export async function sendNotifications(data: NotificationData) {
  // Verify the sender is an admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
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

  // Create notifications using admin client (bypasses RLS)
  const notifications = data.recipientIds.map((userId) => ({
    user_id: userId,
    title: data.title,
    message: data.message,
    type: data.type,
    link: data.link || null,
  }));

  const { error } = await adminClient.from("notifications").insert(notifications);

  if (error) {
    console.error("Error sending notifications:", error);
    return { error: "Failed to send notifications: " + error.message };
  }

  return { success: true, count: data.recipientIds.length };
}
