import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PackageOpen, 
  ArrowUpRight, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function LeadsPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch leads (client_requests) for this affiliate
  const { data: leads } = await adminClient
    .from("client_requests")
    .select(`
      id,
      full_name,
      business_name,
      website_type,
      budget,
      status,
      created_at,
      products (
        name,
        slug,
        commission_percentage
      )
    `)
    .eq("affiliate_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate stats
  const totalLeads = leads?.length || 0;
  const paidLeads = leads?.filter(l => l.status === "paid" || l.status === "completed").length || 0;
  const pendingLeads = leads?.filter(l => l.status === "pending" || l.status === "contacted" || l.status === "quoted").length || 0;
  const conversionRate = totalLeads > 0 ? ((paidLeads / totalLeads) * 100).toFixed(1) : "0";

  const getStatusVariant = (status: string): "default" | "secondary" | "success" | "warning" | "destructive" => {
    switch (status) {
      case "paid":
      case "completed":
        return "success";
      case "pending":
      case "contacted":
      case "quoted":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
      case "contacted":
      case "quoted":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Your Referrals
          </h1>
          <p className="text-muted">
            Track all clients who requested services through your referral links
          </p>
        </div>
        <Link href="/dashboard/marketplace">
          <Button variant="outline" className="group">
            <PackageOpen className="w-4 h-4 mr-2" />
            Browse Products
            <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted mb-1">Total Referrals</p>
            <p className="text-2xl font-heading font-bold text-foreground">{totalLeads}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted mb-1">In Progress</p>
            <p className="text-2xl font-heading font-bold text-foreground">{pendingLeads}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted mb-1">Converted</p>
            <p className="text-2xl font-heading font-bold text-foreground">{paidLeads}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-accent/10">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted mb-1">Conversion Rate</p>
            <p className="text-2xl font-heading font-bold text-foreground">{conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      {!leads || leads.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 rounded-full bg-secondary/50 mb-4">
                <PackageOpen className="w-12 h-12 text-muted" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                No Referrals Yet
              </h3>
              <p className="text-muted text-center max-w-md mb-6">
                Start promoting products from the Marketplace to generate referrals and earn commissions
              </p>
              <Link href="/dashboard/marketplace">
                <Button className="group">
                  Browse Products
                  <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-heading">All Referrals</CardTitle>
              <Badge variant="secondary">
                {totalLeads} {totalLeads === 1 ? "lead" : "leads"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30 border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Client
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Product
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Type
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Budget
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <Calendar className="w-4 h-4" />
                          {new Date(lead.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground">{lead.full_name}</p>
                          {lead.business_name && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Building2 className="w-3.5 h-3.5 text-muted" />
                              <p className="text-sm text-muted">{lead.business_name}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {lead.products?.name || "General Inquiry"}
                          </p>
                          {lead.products?.commission_percentage && (
                            <div className="flex items-center gap-1 mt-1">
                              <DollarSign className="w-3 h-3 text-success" />
                              <p className="text-xs text-success font-semibold">
                                {lead.products.commission_percentage}% commission
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted capitalize">
                          {lead.website_type?.replace("-", " ") || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground capitalize">
                          {lead.budget?.replace("-", " – ") || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={getStatusVariant(lead.status)}
                          className="capitalize inline-flex items-center gap-1.5"
                        >
                          {getStatusIcon(lead.status)}
                          {lead.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border">
              {leads.map((lead: any) => (
                <div key={lead.id} className="p-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{lead.full_name}</p>
                      {lead.business_name && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Building2 className="w-3.5 h-3.5 text-muted shrink-0" />
                          <p className="text-sm text-muted truncate">{lead.business_name}</p>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={getStatusVariant(lead.status)}
                      className="capitalize ml-2 shrink-0"
                    >
                      {lead.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>
                        {new Date(lead.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <PackageOpen className="w-4 h-4 text-muted shrink-0" />
                      <span className="text-foreground font-medium">
                        {lead.products?.name || "General Inquiry"}
                      </span>
                      {lead.products?.commission_percentage && (
                        <Badge variant="success" className="text-xs ml-auto">
                          {lead.products.commission_percentage}%
                        </Badge>
                      )}
                    </div>

                    {lead.website_type && (
                      <div className="text-muted capitalize">
                        Type: {lead.website_type.replace("-", " ")}
                      </div>
                    )}

                    {lead.budget && (
                      <div className="text-foreground font-medium capitalize">
                        Budget: {lead.budget.replace("-", " – ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
