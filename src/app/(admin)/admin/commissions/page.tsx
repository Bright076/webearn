import { createAdminClient } from "@/lib/supabase/admin";
import { CommissionsTable } from "./CommissionsTable";

interface Commission {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  affiliate: {
    id: string;
    full_name: string | null;
    email: string;
    affiliate_code: string | null;
  } | null;
  request: {
    id: string;
    full_name: string;
    website_type: string;
  } | null;
  product: {
    id: string;
    name: string;
  } | null;
}

export default async function AdminCommissionsPage() {
  const adminClient = createAdminClient();

  // Fetch all commissions with related data
  const { data: rawCommissions } = await adminClient
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

  // Transform the data to match expected type
  const commissions: Commission[] = (rawCommissions || []).map((commission: any) => ({
    id: commission.id,
    amount: commission.amount,
    status: commission.status,
    created_at: commission.created_at,
    approved_at: commission.approved_at,
    approved_by: commission.approved_by,
    rejection_reason: commission.rejection_reason,
    affiliate: Array.isArray(commission.affiliate) 
      ? commission.affiliate[0] || null 
      : commission.affiliate,
    request: Array.isArray(commission.request) 
      ? commission.request[0] || null 
      : commission.request,
    product: Array.isArray(commission.product) 
      ? commission.product[0] || null 
      : commission.product,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Commissions
        </h1>
        <p className="text-muted">Review and approve commission payments</p>
      </div>

      <CommissionsTable commissions={commissions} />
    </div>
  );
}
