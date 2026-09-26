import { SendNotificationForm } from "./SendNotificationForm";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminNotificationsPage() {
  const adminClient = createAdminClient();

  // Fetch all affiliates (exclude admins)
  const { data: allProfiles } = await adminClient
    .from("profiles")
    .select("id, full_name, email, affiliate_code")
    .order("full_name");

  const { data: adminUsers } = await adminClient
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  const adminIds = new Set(adminUsers?.map((u) => u.user_id) || []);
  const affiliates = allProfiles?.filter((p) => !adminIds.has(p.id)) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Send Notifications
        </h1>
        <p className="text-muted">
          Send announcements and updates to your affiliates
        </p>
      </div>

      <SendNotificationForm affiliates={affiliates} />
    </div>
  );
}
