import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { FileText, AlertCircle, DollarSign, Wallet } from "lucide-react";

export default async function AdminDashboardPage() {
  const adminClient = createAdminClient();

  // Total Client Requests
  const { count: totalRequests } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true });

  // New/Unattended Requests
  const { count: newRequests } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Pending Commissions
  const { count: pendingCommissions } = await adminClient
    .from("commissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Pending Withdrawals
  const { count: pendingWithdrawals } = await adminClient
    .from("withdrawals")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const stats = [
    {
      title: "Total Client Requests",
      value: totalRequests || 0,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      href: "/admin/requests",
    },
    {
      title: "New/Unattended Requests",
      value: newRequests || 0,
      icon: AlertCircle,
      color: "bg-amber-100 text-amber-600",
      href: "/admin/requests?status=pending",
      highlight: true,
    },
    {
      title: "Pending Commissions",
      value: pendingCommissions || 0,
      icon: DollarSign,
      color: "bg-primary/10 text-primary",
      href: "/admin/commissions",
    },
    {
      title: "Pending Withdrawals",
      value: pendingWithdrawals || 0,
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-600",
      href: "/admin/withdrawals",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted">
          Overview of your platform's activity and pending actions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <div
                className={`bg-white border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
                  stat.highlight ? "border-amber-300 shadow-md" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.highlight && stat.value > 0 && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                      Needs Attention
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-muted mb-1">{stat.title}</h3>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="block w-full px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <p className="font-semibold text-sm text-foreground">📦 Manage Products</p>
              <p className="text-xs text-muted">Add, edit, or remove products</p>
            </Link>
            <Link
              href="/admin/requests?status=pending"
              className="block w-full px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <p className="font-semibold text-sm text-foreground">📋 Review New Requests</p>
              <p className="text-xs text-muted">Process pending client inquiries</p>
            </Link>
            <Link
              href="/admin/commissions"
              className="block w-full px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <p className="font-semibold text-sm text-foreground">💰 Approve Commissions</p>
              <p className="text-xs text-muted">Review and approve affiliate earnings</p>
            </Link>
            <Link
              href="/admin/withdrawals"
              className="block w-full px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
            >
              <p className="font-semibold text-sm text-foreground">💳 Process Withdrawals</p>
              <p className="text-xs text-muted">Handle payout requests</p>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-border rounded-lg p-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">
            Platform Status
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">Active Products</span>
              <span className="font-semibold text-foreground">Loading...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">Active Affiliates</span>
              <span className="font-semibold text-foreground">Loading...</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">Total Revenue</span>
              <span className="font-semibold text-foreground">$0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
