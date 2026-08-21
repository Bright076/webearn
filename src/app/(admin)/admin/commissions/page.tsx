import { createAdminClient } from "@/lib/supabase/admin";
import { CommissionsTable } from "./CommissionsTable";

export default async function AdminCommissionsPage() {
  const adminClient = createAdminClient();

  // Fetch all commissions with related data
  const { data: commissions } = await adminClient
    .from("commissions")
    .select(`
      id,
      amount,
      status,
      created_at,
      approved_at,
      approved_by,
      rejection_reason,
      affiliate:profiles!commissions_affiliate_id_fkey(id, full_name, email, affiliate_code),
      request:client_requests(id, full_name, website_type),
      product:products(id, name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Commissions
        </h1>
        <p className="text-muted">Review and approve commission payments</p>
      </div>

      <CommissionsTable commissions={commissions || []} />
    </div>
  );
}
