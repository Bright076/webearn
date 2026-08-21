import { MarketingNav } from "@/components/marketing/nav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PromoteButton } from "@/components/marketplace/PromoteButton";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  commission_type: "fixed" | "percentage";
  commission_value: number;
  delivery_days: number | null;
  thumbnail_url: string | null;
  demo_url: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default async function MarketplacePage() {
  const supabase = createAdminClient();

  // Fetch categories
  const { data: categories } = await supabase
    .from("product_categories")
    .select("id, name, slug");

  // Fetch all active products
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching products:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error hint:", error.hint);
    console.error("Error details:", error.details);
  } else {
    console.log("Products fetched successfully:", products?.length || 0, "products");
  }

  // Create a map of category IDs to category data
  const categoryMap = new Map<string, Category>();
  categories?.forEach((cat) => {
    categoryMap.set(cat.id, cat);
  });

  // Separate products by category slug
  const services = products?.filter((p) => {
    const category = p.category_id ? categoryMap.get(p.category_id) : null;
    return category?.slug === "website-services";
  }) || [];
  
  const templates = products?.filter((p) => {
    const category = p.category_id ? categoryMap.get(p.category_id) : null;
    return category?.slug === "website-templates";
  }) || [];

  const formatCommission = (type: string, value: number) => {
    if (type === "fixed") {
      return `$${value.toLocaleString()}`;
    }
    return `${value}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3">
            Marketplace
          </h1>
          <p className="text-lg text-muted">
            Browse services and templates you can promote
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services">
          <TabsList className="mb-8">
            <TabsTrigger value="services">Website Services</TabsTrigger>
            <TabsTrigger value="templates">Website Templates</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            {services.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <PackageOpen className="w-16 h-16 text-muted mb-4" />
                <p className="text-xl text-muted">
                  No services available yet — check back soon
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-border rounded-lg p-6"
                  >
                    <h3 className="text-xl font-heading font-semibold mb-4">
                      {product.name}
                    </h3>
                    
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Price:</span>
                        <span className="font-semibold">
                          ${product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Commission:</span>
                        <span className="font-semibold text-accent">
                          {formatCommission(product.commission_type, product.commission_value)}
                        </span>
                      </div>
                      {product.delivery_days && (
                        <div className="flex justify-between">
                          <span className="text-muted">Delivery:</span>
                          <span className="font-semibold">
                            {product.delivery_days} {product.delivery_days === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      )}
                    </div>

                    <PromoteButton
                      productSlug={product.slug}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            {templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <PackageOpen className="w-16 h-16 text-muted mb-4" />
                <p className="text-xl text-muted">
                  No templates available yet — check back soon
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-border rounded-lg overflow-hidden"
                  >
                    {/* Thumbnail */}
                    {product.thumbnail_url ? (
                      <img
                        src={product.thumbnail_url}
                        alt={product.name}
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-muted/20 flex items-center justify-center">
                        <span className="text-muted">No preview</span>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-heading font-semibold mb-3">
                        {product.name}
                      </h3>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted">Price:</span>
                          <span className="font-semibold">
                            ${product.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Commission:</span>
                          <span className="font-semibold text-accent">
                            {formatCommission(product.commission_type, product.commission_value)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {product.demo_url ? (
                          <Button
                            variant="outline"
                            className="flex-1"
                            asChild
                          >
                            <a
                              href={product.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Demo
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="flex-1"
                            disabled
                          >
                            View Demo
                          </Button>
                        )}
                        <PromoteButton
                          productSlug={product.slug}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

