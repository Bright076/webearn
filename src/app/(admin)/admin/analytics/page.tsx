import { createAdminClient } from "@/lib/supabase/admin";

interface TopAffiliate {
  id: string;
  full_name: string | null;
  email: string;
  affiliate_code: string | null;
  total_leads: number;
  total_commission: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string | null;
  request_count: number;
  paid_count: number;
  conversion_rate: number;
}

export default async function AnalyticsPage() {
  const adminClient = createAdminClient();

  // Top Affiliates by total approved commission
  const { data: topAffiliates } = await adminClient
    .rpc('get_top_affiliates')
    .limit(10);

  // If RPC doesn't exist, use manual query
  let affiliatesData: TopAffiliate[] = [];
  if (!topAffiliates) {
    const { data: commissionsData } = await adminClient
      .from("commissions")
      .select(`
        amount,
        status,
        affiliate:profiles!commissions_affiliate_id_fkey(id, full_name, email, affiliate_code)
      `)
      .in("status", ["approved", "paid"]);

    const affiliateMap = new Map<string, TopAffiliate>();

    commissionsData?.forEach((commission: any) => {
      const affiliate = Array.isArray(commission.affiliate)
        ? commission.affiliate[0]
        : commission.affiliate;

      if (affiliate) {
        if (!affiliateMap.has(affiliate.id)) {
          affiliateMap.set(affiliate.id, {
            id: affiliate.id,
            full_name: affiliate.full_name,
            email: affiliate.email,
            affiliate_code: affiliate.affiliate_code,
            total_leads: 0,
            total_commission: 0,
          });
        }
        const current = affiliateMap.get(affiliate.id)!;
        current.total_commission += Number(commission.amount);
        current.total_leads += 1;
      }
    });

    affiliatesData = Array.from(affiliateMap.values())
      .sort((a, b) => b.total_commission - a.total_commission)
      .slice(0, 10);
  } else {
    affiliatesData = topAffiliates;
  }

  // Top Products by request count
  const { data: products } = await adminClient
    .from("products")
    .select(`
      id,
      name,
      category:product_categories(name)
    `);

  const { data: requests } = await adminClient
    .from("client_requests")
    .select("product_id, status");

  const productStats = new Map<string, TopProduct>();

  products?.forEach((product: any) => {
    const categoryName = Array.isArray(product.category)
      ? product.category[0]?.name
      : product.category?.name;

    productStats.set(product.id, {
      id: product.id,
      name: product.name,
      category: categoryName || null,
      request_count: 0,
      paid_count: 0,
      conversion_rate: 0,
    });
  });

  requests?.forEach((request) => {
    if (request.product_id && productStats.has(request.product_id)) {
      const stat = productStats.get(request.product_id)!;
      stat.request_count += 1;
      if (request.status === "paid") {
        stat.paid_count += 1;
      }
    }
  });

  productStats.forEach((stat) => {
    if (stat.request_count > 0) {
      stat.conversion_rate = (stat.paid_count / stat.request_count) * 100;
    }
  });

  const topProducts = Array.from(productStats.values())
    .sort((a, b) => b.request_count - a.request_count)
    .slice(0, 10);

  // Conversion Funnel Stats
  const { count: totalReferralClicks } = await adminClient
    .from("referral_clicks")
    .select("*", { count: "exact", head: true });

  const { count: totalRequests } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true });

  const { count: paidRequests } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid");

  const clickToRequestRate =
    totalReferralClicks && totalRequests
      ? ((totalRequests / totalReferralClicks) * 100).toFixed(1)
      : "0";

  const requestToPaidRate =
    totalRequests && paidRequests
      ? ((paidRequests / totalRequests) * 100).toFixed(1)
      : "0";

  const overallConversionRate =
    totalReferralClicks && paidRequests
      ? ((paidRequests / totalReferralClicks) * 100).toFixed(1)
      : "0";

  // This Month vs Last Month
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const { count: thisMonthRequests } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfThisMonth.toISOString());

  const { count: lastMonthRequests } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfLastMonth.toISOString())
    .lte("created_at", endOfLastMonth.toISOString());

  const { data: thisMonthCommissions } = await adminClient
    .from("commissions")
    .select("amount")
    .in("status", ["approved", "paid"])
    .gte("approved_at", startOfThisMonth.toISOString());

  const { data: lastMonthCommissions } = await adminClient
    .from("commissions")
    .select("amount")
    .in("status", ["approved", "paid"])
    .gte("approved_at", startOfLastMonth.toISOString())
    .lte("approved_at", endOfLastMonth.toISOString());

  const thisMonthCommissionTotal =
    thisMonthCommissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  const lastMonthCommissionTotal =
    lastMonthCommissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

  const requestsChange =
    lastMonthRequests && lastMonthRequests > 0
      ? (((thisMonthRequests || 0) - lastMonthRequests) / lastMonthRequests) * 100
      : 0;

  const commissionsChange =
    lastMonthCommissionTotal > 0
      ? ((thisMonthCommissionTotal - lastMonthCommissionTotal) /
          lastMonthCommissionTotal) *
        100
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Analytics
        </h1>
        <p className="text-muted">Business insights and performance metrics</p>
      </div>

      {/* Conversion Funnel */}
      <div>
        <h2 className="text-xl font-heading font-semibold mb-4">Conversion Funnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-muted mb-1">Referral Clicks</p>
            <p className="text-4xl font-bold text-foreground mb-2">
              {totalReferralClicks?.toLocaleString() || 0}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted">→</span>
              <span className="font-semibold text-blue-600">{clickToRequestRate}%</span>
              <span className="text-muted">to requests</span>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-muted mb-1">Client Requests</p>
            <p className="text-4xl font-bold text-foreground mb-2">
              {totalRequests?.toLocaleString() || 0}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted">→</span>
              <span className="font-semibold text-emerald-600">{requestToPaidRate}%</span>
              <span className="text-muted">to paid</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <p className="text-sm text-emerald-800 mb-1">Paid Requests</p>
            <p className="text-4xl font-bold text-emerald-900 mb-2">
              {paidRequests?.toLocaleString() || 0}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-emerald-700">{overallConversionRate}%</span>
              <span className="text-emerald-600">overall conversion</span>
            </div>
          </div>
        </div>
      </div>

      {/* This Month vs Last Month */}
      <div>
        <h2 className="text-xl font-heading font-semibold mb-4">
          This Month vs Last Month
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-muted mb-1">New Requests</p>
            <div className="flex items-baseline gap-3 mb-2">
              <p className="text-3xl font-bold text-foreground">
                {thisMonthRequests || 0}
              </p>
              <span className="text-sm text-muted">this month</span>
            </div>
            <div className="flex items-center gap-2">
              {requestsChange > 0 ? (
                <>
                  <span className="text-emerald-600 font-semibold text-sm">
                    ↑ {requestsChange.toFixed(1)}%
                  </span>
                  <span className="text-muted text-sm">vs last month ({lastMonthRequests})</span>
                </>
              ) : requestsChange < 0 ? (
                <>
                  <span className="text-red-600 font-semibold text-sm">
                    ↓ {Math.abs(requestsChange).toFixed(1)}%
                  </span>
                  <span className="text-muted text-sm">vs last month ({lastMonthRequests})</span>
                </>
              ) : (
                <span className="text-muted text-sm">No change from last month</span>
              )}
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <p className="text-sm text-muted mb-1">Approved Commissions</p>
            <div className="flex items-baseline gap-3 mb-2">
              <p className="text-3xl font-bold text-foreground">
                ${thisMonthCommissionTotal.toLocaleString()}
              </p>
              <span className="text-sm text-muted">this month</span>
            </div>
            <div className="flex items-center gap-2">
              {commissionsChange > 0 ? (
                <>
                  <span className="text-emerald-600 font-semibold text-sm">
                    ↑ {commissionsChange.toFixed(1)}%
                  </span>
                  <span className="text-muted text-sm">
                    vs last month (${lastMonthCommissionTotal.toLocaleString()})
                  </span>
                </>
              ) : commissionsChange < 0 ? (
                <>
                  <span className="text-red-600 font-semibold text-sm">
                    ↓ {Math.abs(commissionsChange).toFixed(1)}%
                  </span>
                  <span className="text-muted text-sm">
                    vs last month (${lastMonthCommissionTotal.toLocaleString()})
                  </span>
                </>
              ) : (
                <span className="text-muted text-sm">No change from last month</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Affiliates */}
      <div>
        <h2 className="text-xl font-heading font-semibold mb-4">Top Affiliates</h2>
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Rank
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Affiliate Code
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Total Leads
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Total Commission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {affiliatesData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted">
                      No affiliate data yet
                    </td>
                  </tr>
                ) : (
                  affiliatesData.map((affiliate, index) => (
                    <tr key={affiliate.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground">
                            {affiliate.full_name || "N/A"}
                          </p>
                          <p className="text-xs text-muted">{affiliate.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-mono">
                        {affiliate.affiliate_code || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">
                        {affiliate.total_leads}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-accent">
                        ${affiliate.total_commission.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div>
        <h2 className="text-xl font-heading font-semibold mb-4">Top Products</h2>
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Rank
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Category
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Total Requests
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Paid
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted">
                      No product data yet
                    </td>
                  </tr>
                ) : (
                  topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{product.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {product.category || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-foreground">
                        {product.request_count}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                        {product.paid_count}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-bold ${
                            product.conversion_rate >= 50
                              ? "text-emerald-600"
                              : product.conversion_rate >= 25
                              ? "text-blue-600"
                              : "text-amber-600"
                          }`}
                        >
                          {product.conversion_rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
