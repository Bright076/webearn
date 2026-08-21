import { Badge } from "@/components/ui/badge";
import { PackageOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        slug
      )
    `)
    .eq("affiliate_id", user.id)
    .order("created_at", { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "contacted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "quoted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "completed":
        return "bg-primary/10 text-primary border-primary/20";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Your Leads
        </h1>
        <p className="text-muted">
          Track all the clients who requested services through your referral links
        </p>
      </div>

      {!leads || leads.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12">
          <div className="flex flex-col items-center justify-center">
            <PackageOpen className="w-16 h-16 text-muted mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">No Leads Yet</p>
            <p className="text-muted text-center max-w-md mb-6">
              Start promoting products from the Marketplace to get leads and earn commissions
            </p>
            <Link href="/dashboard/marketplace">
              <Button>Browse Products to Promote</Button>
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
                    Client Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Budget
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(lead.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{lead.full_name}</p>
                        {lead.business_name && (
                          <p className="text-sm text-muted">{lead.business_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {lead.products?.name || "General Inquiry"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted capitalize">
                      {lead.website_type?.replace("-", " ")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted capitalize">
                      {lead.budget?.replace("-", " - ")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`${getStatusColor(lead.status)} capitalize`}
                        variant="outline"
                      >
                        {lead.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="bg-secondary/30 px-6 py-4 border-t border-border">
            <p className="text-sm text-muted">
              Total: <span className="font-semibold text-foreground">{leads.length}</span>{" "}
              {leads.length === 1 ? "lead" : "leads"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
