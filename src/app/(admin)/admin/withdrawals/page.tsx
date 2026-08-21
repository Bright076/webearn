import { createAdminClient } from "@/lib/supabase/admin";
import { WithdrawalsTable } from "./WithdrawalsTable";

export default async function AdminWithdrawalsPage() {
  const adminClient = createAdminClient();

  // Fetch all withdrawals with related data
  const { data: withdrawals } = await adminClient
    .from("withdrawals")
    .select(`
      id,
      amount,
      status,
      created_at,
      processed_at,
      processed_by,
      rejection_reason,
      bank_snapshot,
      affiliate:profiles!withdrawals_affiliate_id_fkey(id, full_name, email, affiliate_code)
    `)
    .order("created_at", { ascending: false });

  // Calculate summary stats
  const pending = withdrawals?.filter((w) => w.status === "pending") || [];
  const pendingTotal = pending.reduce((sum, w) => sum + Number(w.amount), 0);

  // Total paid this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidThisMonth = withdrawals?.filter((w) => {
    if (w.status !== "paid" || !w.processed_at) return false;
    const processedDate = new Date(w.processed_at);
    return processedDate >= startOfMonth;
  }) || [];
  const paidThisMonthTotal = paidThisMonth.reduce((sum, w) => sum + Number(w.amount), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Withdrawals
        </h1>
        <p className="text-muted">Process affiliate withdrawal requests</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <p className="text-sm text-amber-800 mb-1">Total Pending Amount</p>
          <p className="text-3xl font-bold text-amber-900">
            ${pendingTotal.toLocaleString()}
          </p>
          <p className="text-xs text-amber-600 mt-1">{pending.length} pending requests</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <p className="text-sm text-emerald-800 mb-1">Total Paid This Month</p>
          <p className="text-3xl font-bold text-emerald-900">
            ${paidThisMonthTotal.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-600 mt-1">{paidThisMonth.length} payments processed</p>
        </div>
      </div>

      <WithdrawalsTable withdrawals={withdrawals || []} />
    </div>
  );
}
