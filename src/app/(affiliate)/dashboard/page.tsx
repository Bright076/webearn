import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PackageOpen, TrendingUp, Users, DollarSign, Wallet } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user profile
  const { data: profile } = await adminClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Total Leads
  const { count: totalLeads } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_id", user.id);

  // Pending Commission
  const { data: pendingCommissions } = await adminClient
    .from("commissions")
    .select("amount")
    .eq("affiliate_id", user.id)
    .eq("status", "pending");

  const pendingTotal = pendingCommissions?.reduce(
    (sum, c) => sum + Number(c.amount),
    0
  ) || 0;

  // Approved Commission
  const { data: approvedCommissions } = await adminClient
    .from("commissions")
    .select("amount")
    .eq("affiliate_id", user.id)
    .in("status", ["approved", "paid"]);

  const approvedTotal = approvedCommissions?.reduce(
    (sum, c) => sum + Number(c.amount),
    0
  ) || 0;

  // Withdrawn Amount
  const { data: completedWithdrawals } = await adminClient
    .from("withdrawals")
    .select("amount")
    .eq("affiliate_id", user.id)
    .eq("status", "completed");

  const withdrawnTotal = completedWithdrawals?.reduce(
    (sum, w) => sum + Number(w.amount),
    0
  ) || 0;

  // Available Balance (approved - withdrawn)
  const availableBalance = approvedTotal - withdrawnTotal;

  // Recent requests
  const { data: recentRequests } = await adminClient
    .from("client_requests")
    .select("id, full_name, status, created_at, products(name)")
    .eq("affiliate_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-muted mb-1">Total Leads</h3>
          <p className="text-3xl font-heading font-bold text-foreground">
            {totalLeads || 0}
          </p>
          <p className="text-sm text-muted mt-2">All time referrals</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
            <Badge className="bg-accent text-white">Pending</Badge>
          </div>
          <h3 className="text-sm font-medium text-muted mb-1">Pending Commission</h3>
          <p className="text-3xl font-heading font-bold text-foreground">
            ${pendingTotal.toLocaleString()}
          </p>
          <p className="text-sm text-muted mt-2">Awaiting approval</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <Badge variant="default">Approved</Badge>
          </div>
          <h3 className="text-sm font-medium text-muted mb-1">Approved Commission</h3>
          <p className="text-3xl font-heading font-bold text-foreground">
            ${approvedTotal.toLocaleString()}
          </p>
          <p className="text-sm text-muted mt-2">Total earned</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-accent" />
            </div>
            {availableBalance > 0 && <Badge variant="secondary">Available</Badge>}
          </div>
          <h3 className="text-sm font-medium text-muted mb-1">Available Balance</h3>
          <p className="text-3xl font-heading font-bold text-foreground">
            ${availableBalance.toLocaleString()}
          </p>
          {availableBalance >= 50 ? (
            <Link href="/dashboard/withdrawals">
              <p className="text-sm text-primary hover:underline mt-2">
                Request withdrawal →
              </p>
            </Link>
          ) : (
            <p className="text-sm text-muted mt-2">Min. $50 to withdraw</p>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground">
              Recent Leads
            </h2>
            <Link href="/dashboard/leads">
              <span className="text-sm text-primary hover:underline">View all →</span>
            </Link>
          </div>

          {!recentRequests || recentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <PackageOpen className="w-16 h-16 text-muted mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">No Leads Yet</p>
              <p className="text-sm text-muted text-center max-w-sm mb-6">
                Start promoting products to get leads and earn commissions
              </p>
              <Link href="/dashboard/marketplace" className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-background transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{request.full_name}</p>
                    <p className="text-sm text-muted">
                      {request.products?.name || "General Inquiry"}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      request.status === "paid"
                        ? "default"
                        : request.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="font-heading font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/marketplace"
                className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <p className="font-semibold text-sm text-foreground">
                  🛒 Browse Products
                </p>
                <p className="text-xs text-muted">Get product referral links</p>
              </Link>
              <Link
                href="/dashboard/leads"
                className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <p className="font-semibold text-sm text-foreground">👥 View Leads</p>
                <p className="text-xs text-muted">Track your referrals</p>
              </Link>
              {availableBalance >= 50 && (
                <Link
                  href="/dashboard/withdrawals"
                  className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <p className="font-semibold text-sm text-foreground">
                    💳 Request Payout
                  </p>
                  <p className="text-xs text-muted">
                    ${availableBalance.toLocaleString()} available
                  </p>
                </Link>
              )}
              <Link
                href="/dashboard/profile"
                className="block w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <p className="font-semibold text-sm text-foreground">⚙️ Update Profile</p>
                <p className="text-xs text-muted">Add payment details</p>
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-border rounded-lg p-6">
            <h3 className="font-heading font-bold text-foreground mb-4">
              How It Works
            </h3>
            <div className="space-y-3 text-sm text-foreground">
              <div className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <p>Browse products in the Marketplace</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <p>Get your unique referral link for each product</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <p>Share the link with potential clients</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <p>Earn commission when they complete payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
