import { createAdminClient } from "@/lib/supabase/admin";
import { ProductsTable } from "./ProductsTable";

export default async function ProductsPage() {
  const adminClient = createAdminClient();

  // Fetch all products (including inactive)
  const { data: products } = await adminClient
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      commission_type,
      commission_value,
      delivery_days,
      demo_url,
      thumbnail_url,
      is_active,
      description,
      product_categories (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  // Fetch categories for the form
  const { data: categories } = await adminClient
    .from("product_categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Products
          </h1>
          <p className="text-muted">
            Manage your products and services that affiliates can promote
          </p>
        </div>
      </div>

      <ProductsTable
        products={products || []}
        categories={categories || []}
      />
    </div>
  );
}
