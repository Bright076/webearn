import { createAdminClient } from "@/lib/supabase/admin";
import { AffiliatesTable } from "./AffiliatesTable";

export default async function AdminAffiliatesPage() {
  const adminClient = createAdminClient();

  // Fetch all affiliates with their stats
  const { data: affiliates } = await adminClient
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      affiliate_code,
      status,
      bank_name,
      bank_account_number,
      bank_account_name,
      created_at
    `)
    .order("created_at", { ascending: false });

  // For each affiliate, get their stats
  const affiliatesWithStats = await Promise.all(
    (affiliates || []).map(async (affiliate) => {
      // Count total leads
      const { count: totalLeads } = await adminClient
        .from("client_requests")
        .select("*", { count: "exact", head: true })
        .eq("affiliate_id", affiliate.id);

      // Sum approved commissions
      const { data: commissions } = await adminClient
        .from("commissions")
        .select("amount")
        .eq("affiliate_id", affiliate.id)
        .in("status", ["approved", "paid"]);

      const totalCommission = commissions?.reduce(
        (sum, c) => sum + Number(c.amount),
        0
      ) || 0;

      return {
        ...affiliate,
        totalLeads: totalLeads || 0,
        totalCommission,
      };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Affiliates
        </h1>
        <p className="text-muted">View and manage affiliate accounts</p>
      </div>

      <AffiliatesTable affiliates={affiliatesWithStats} />
    </div>
  );
}
