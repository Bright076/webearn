import { createAdminClient } from "@/lib/supabase/admin";
import { RequestsTable } from "./RequestsTable";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const adminClient = createAdminClient();

  // Fetch all client requests with related data
  let query = adminClient
    .from("client_requests")
    .select(
      `
      *,
      products (
        id,
        name,
        slug
      ),
      profiles!client_requests_affiliate_id_fkey (
        id,
        full_name,
        affiliate_code
      )
    `
    )
    .order("created_at", { ascending: false });

  // Apply status filter
  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  // Apply affiliate filter
  if (params.filter === "has_affiliate") {
    query = query.not("affiliate_id", "is", null);
  } else if (params.filter === "direct") {
    query = query.is("affiliate_id", null);
  }

  const { data: requests, error } = await query;

  if (error) {
    console.error("Error fetching requests:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Client Requests
        </h1>
        <p className="text-muted">
          Manage all client inquiries and move them through your sales pipeline
        </p>
      </div>

      <RequestsTable requests={requests || []} />
    </div>
  );
}
