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

  // Platform Status Stats
  const { count: activeProducts } = await adminClient
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Count only affiliates (not admins) - users with profiles but not in user_roles as admin
  const { data: allProfiles } = await adminClient
    .from("profiles")
    .select("id");

  const { data: adminUsers } = await adminClient
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin");

  const adminIds = new Set(adminUsers?.map((u) => u.user_id) || []);
  const activeAffiliates = allProfiles?.filter((p) => !adminIds.has(p.id)).length || 0;

  // Total Revenue (paid requests)
  const { data: paidRequests } = await adminClient
    .from("client_requests")
    .select("products(price)")
    .eq("status", "paid");

  const totalRevenue = paidRequests?.reduce((sum, req: any) => {
    const product = Array.isArray(req.products) ? req.products[0] : req.products;
    return sum + (product?.price ? Number(product.price) : 0);
  }, 0) || 0;

  // Visitor Statistics
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  thisWeekStart.setHours(0, 0, 0, 0);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Today's visitors (unique IPs)
  const { data: todayViews } = await adminClient
    .from("page_views")
    .select("ip_hash")
    .gte("created_at", today.toISOString());

  const uniqueToday = new Set(todayViews?.map((v) => v.ip_hash) || []).size;

  // This week's visitors
  const { data: weekViews } = await adminClient
    .from("page_views")
    .select("ip_hash")
    .gte("created_at", thisWeekStart.toISOString());

  const uniqueThisWeek = new Set(weekViews?.map((v) => v.ip_hash) || []).size;

  // This month's visitors
  const { data: monthViews } = await adminClient
    .from("page_views")
    .select("ip_hash")
    .gte("created_at", thisMonthStart.toISOString());

  const uniqueThisMonth = new Set(monthViews?.map((v) => v.ip_hash) || []).size;

  // Total page views
  const { count: totalPageViews } = await adminClient
    .from("page_views")
    .select("*", { count: "exact", head: true });

  // Top pages
  const { data: allViews } = await adminClient
    .from("page_views")
    .select("page_url")
    .gte("created_at", thisMonthStart.toISOString());

  const pageCount = new Map<string, number>();
  allViews?.forEach((view) => {
    pageCount.set(view.page_url, (pageCount.get(view.page_url) || 0) + 1);
  });

  const topPages = Array.from(pageCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([url, count]) => ({ url, count }));

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
              <span className="font-semibold text-foreground">{activeProducts || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">Active Affiliates</span>
              <span className="font-semibold text-foreground">{activeAffiliates}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted">Total Revenue</span>
              <span className="font-semibold text-foreground">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Statistics */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-6">
          📊 Visitor Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-1">Today</p>
            <p className="text-2xl font-bold text-blue-900">{uniqueToday}</p>
            <p className="text-xs text-blue-600">unique visitors</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800 mb-1">This Week</p>
            <p className="text-2xl font-bold text-purple-900">{uniqueThisWeek}</p>
            <p className="text-xs text-purple-600">unique visitors</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-emerald-800 mb-1">This Month</p>
            <p className="text-2xl font-bold text-emerald-900">{uniqueThisMonth}</p>
            <p className="text-xs text-emerald-600">unique visitors</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 mb-1">Total Views</p>
            <p className="text-2xl font-bold text-amber-900">{totalPageViews || 0}</p>
            <p className="text-xs text-amber-600">all time</p>
          </div>
        </div>

        {topPages.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Top Pages This Month</h3>
            <div className="space-y-2">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded">
                  <span className="text-sm text-foreground truncate flex-1">{page.url}</span>
                  <span className="text-sm font-semibold text-primary ml-4">{page.count} views</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
