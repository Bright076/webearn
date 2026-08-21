import { Badge } from "@/components/ui/badge";
import { PackageOpen, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EarningsPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch commissions for this affiliate
  const { data: commissions } = await adminClient
    .from("commissions")
    .select(`
      id,
      amount,
      status,
      created_at,
      client_requests (
        full_name,
        business_name
      ),
      products (
        name
      )
    `)
    .eq("affiliate_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate totals
  const totalEarned = commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  const pendingTotal =
    commissions
      ?.filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  const approvedTotal =
    commissions
      ?.filter((c) => c.status === "approved" || c.status === "paid")
      .reduce((sum, c) => sum + Number(c.amount), 0) || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Earnings
        </h1>
        <p className="text-muted">
          Track your commissions and see how much you've earned
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-muted">Total Earned</h3>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">
            ${totalEarned.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-sm font-medium text-muted">Pending</h3>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">
            ${pendingTotal.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-medium text-muted">Approved/Paid</h3>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">
            ${approvedTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Commissions Table */}
      {!commissions || commissions.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12">
          <div className="flex flex-col items-center justify-center">
            <PackageOpen className="w-16 h-16 text-muted mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">No Earnings Yet</p>
            <p className="text-muted text-center max-w-md mb-6">
              You'll see your commissions here once your referrals are converted to paid clients
            </p>
            <Link href="/dashboard/marketplace">
              <Button>Start Promoting</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Client
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Product
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {commissions.map((commission: any) => (
                  <tr key={commission.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(commission.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {commission.client_requests?.full_name || "Client"}
                        </p>
                        {commission.client_requests?.business_name && (
                          <p className="text-sm text-muted">
                            {commission.client_requests.business_name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {commission.products?.name || "Service"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-foreground">
                        ${Number(commission.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`${getStatusColor(commission.status)} capitalize`}
                        variant="outline"
                      >
                        {commission.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="bg-secondary/30 px-6 py-4 border-t border-border flex justify-between items-center">
            <p className="text-sm text-muted">
              Total: <span className="font-semibold text-foreground">{commissions.length}</span>{" "}
              {commissions.length === 1 ? "commission" : "commissions"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              Total Amount: ${totalEarned.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
