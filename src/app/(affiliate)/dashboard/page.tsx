import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { 
  PackageOpen, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Sparkles
} from "lucide-react";

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

  // Conversion Rate
  const { count: paidLeads } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_id", user.id)
    .eq("status", "paid");

  const conversionRate = totalLeads ? ((paidLeads || 0) / totalLeads * 100).toFixed(1) : "0";

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
  const { data: processedWithdrawals } = await adminClient
    .from("withdrawals")
    .select("amount")
    .eq("affiliate_id", user.id)
    .in("status", ["approved", "paid"]);

  const withdrawnTotal = processedWithdrawals?.reduce(
    (sum, w) => sum + Number(w.amount),
    0
  ) || 0;

  // Available Balance
  const availableBalance = approvedTotal - withdrawnTotal;

  // Recent requests
  const { data: recentRequests } = await adminClient
    .from("client_requests")
    .select("id, full_name, status, created_at, products(name)")
    .eq("affiliate_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Status icon helper
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}!
          </h1>
          <p className="text-muted">
            Here's an overview of your affiliate performance
          </p>
        </div>
        {profile?.affiliate_code && (
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
            <span className="text-sm text-muted">Your Code:</span>
            <code className="text-sm font-bold font-mono text-primary">{profile.affiliate_code}</code>
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                All Time
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted mb-1">Total Referrals</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-2">
              {totalLeads || 0}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted">
              <span>{paidLeads || 0} converted</span>
              <span>•</span>
              <span className="text-success font-semibold">{conversionRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Commission */}
        <Card className="hover:shadow-lg transition-shadow border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <Badge variant="warning" className="text-xs">
                Pending
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted mb-1">Pending Commission</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-2">
              ${pendingTotal.toLocaleString()}
            </p>
            <p className="text-xs text-muted">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        {/* Total Earned */}
        <Card className="hover:shadow-lg transition-shadow border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <Badge variant="success" className="text-xs">
                Approved
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted mb-1">Total Earned</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-2">
              ${approvedTotal.toLocaleString()}
            </p>
            <p className="text-xs text-muted">
              All time earnings
            </p>
          </CardContent>
        </Card>

        {/* Available Balance */}
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              {availableBalance >= 5 && (
                <Badge variant="default" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-muted mb-1">Available Balance</p>
            <p className="text-3xl font-heading font-bold text-foreground mb-2">
              ${availableBalance.toLocaleString()}
            </p>
            {availableBalance >= 5 ? (
              <Link href="/dashboard/withdrawals">
                <span className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
                  Withdraw now <ArrowUpRight className="w-3 h-3" />
                </span>
              </Link>
            ) : (
              <p className="text-xs text-muted">
                Minimum $5 required
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads - 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-heading">Recent Referrals</CardTitle>
                <Link href="/dashboard/leads">
                  <Button variant="ghost" size="sm">
                    View all
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {!recentRequests || recentRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 rounded-full bg-secondary/50 mb-4">
                    <PackageOpen className="w-12 h-12 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Referrals Yet
                  </h3>
                  <p className="text-sm text-muted text-center max-w-md mb-6">
                    Start promoting products to generate referrals and earn commissions
                  </p>
                  <Link href="/dashboard/marketplace">
                    <Button className="group">
                      Browse Products
                      <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map((request: any) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-1">
                          {getStatusIcon(request.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {request.full_name}
                          </p>
                          <p className="text-sm text-muted truncate">
                            {request.products?.name || "General Inquiry"}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {new Date(request.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          request.status === "paid" || request.status === "completed"
                            ? "success"
                            : request.status === "pending"
                            ? "warning"
                            : "secondary"
                        }
                        className="ml-3"
                      >
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Link href="/dashboard/marketplace">
                  <Button variant="outline" className="w-full justify-start" size="default">
                    <PackageOpen className="w-4 h-4 mr-3" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">Browse Products</p>
                      <p className="text-xs text-muted">Get referral links</p>
                    </div>
                  </Button>
                </Link>

                <Link href="/dashboard/leads">
                  <Button variant="outline" className="w-full justify-start" size="default">
                    <Users className="w-4 h-4 mr-3" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">View Referrals</p>
                      <p className="text-xs text-muted">Track your leads</p>
                    </div>
                  </Button>
                </Link>

                {availableBalance >= 5 && (
                  <Link href="/dashboard/withdrawals">
                    <Button variant="default" className="w-full justify-start" size="default">
                      <Wallet className="w-4 h-4 mr-3" />
                      <div className="text-left flex-1">
                        <p className="font-semibold text-sm">Request Withdrawal</p>
                        <p className="text-xs opacity-90">${availableBalance.toLocaleString()} available</p>
                      </div>
                    </Button>
                  </Link>
                )}

                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full justify-start" size="default">
                    <DollarSign className="w-4 h-4 mr-3" />
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm">Payment Details</p>
                      <p className="text-xs text-muted">Update your info</p>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Performance Tip */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Earning Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="font-bold text-primary shrink-0">1.</span>
                <p className="text-foreground">Choose products that match your audience</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary shrink-0">2.</span>
                <p className="text-foreground">Share your referral links on social media</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary shrink-0">3.</span>
                <p className="text-foreground">Follow up with leads to increase conversions</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary shrink-0">4.</span>
                <p className="text-foreground">Track which products perform best</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
