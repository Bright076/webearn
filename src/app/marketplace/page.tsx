import Link from "next/link";
import Image from "next/image";
import { MarketingNav } from "@/components/marketing/nav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromoteButton } from "@/components/marketplace/PromoteButton";
import { 
  PackageOpen, 
  Globe, 
  Clock, 
  DollarSign, 
  TrendingUp,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace - Website Services & Templates | WebEarn",
  description: "Browse and promote professional website services and templates. Earn up to 30% commission on every successful referral.",
};

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
  description: string | null;
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

  // Create category map
  const categoryMap = new Map<string, Category>();
  categories?.forEach((cat) => {
    categoryMap.set(cat.id, cat);
  });

  // Separate products by category
  const services = products?.filter((p) => {
    const category = p.category_id ? categoryMap.get(p.category_id) : null;
    return category?.slug === "website-services";
  }) || [];
  
  const templates = products?.filter((p) => {
    const category = p.category_id ? categoryMap.get(p.category_id) : null;
    return category?.slug === "website-templates";
  }) || [];

  // Calculate commission amount
  const getCommissionAmount = (price: number, type: string, value: number) => {
    if (type === "fixed") {
      return value;
    }
    return (price * value) / 100;
  };

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const category = product.category_id ? categoryMap.get(product.category_id) : null;
    const commissionAmount = getCommissionAmount(
      product.price,
      product.commission_type,
      product.commission_value
    );

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-video overflow-hidden bg-secondary/30">
            {product.thumbnail_url ? (
              <Image
                src={product.thumbnail_url}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center">
                <Globe className="w-16 h-16 text-muted/40 mb-2" />
                <span className="text-sm text-muted">No preview available</span>
              </div>
            )}
            
            {/* Category Badge */}
            {category && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="backdrop-blur-sm bg-white/90">
                  {category.name}
                </Badge>
              </div>
            )}

            {/* Popular Badge (example - can be dynamic) */}
            {product.commission_value >= 25 && (
              <div className="absolute top-3 right-3">
                <Badge variant="accent" className="backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  High Commission
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6">
            <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                <DollarSign className="w-4 h-4 text-muted flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted">Price</p>
                  <p className="font-bold text-sm truncate">${product.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20">
                <TrendingUp className="w-4 h-4 text-success flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted">You Earn</p>
                  <p className="font-bold text-sm text-success truncate">
                    ${commissionAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {product.delivery_days && (
                <div className="col-span-2 flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <Clock className="w-4 h-4 text-muted flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Delivery Time</p>
                    <p className="font-semibold text-sm">
                      {product.delivery_days} {product.delivery_days === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {product.demo_url ? (
                <Button
                  variant="outline"
                  size="default"
                  className="flex-1"
                  asChild
                >
                  <a
                    href={product.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Demo
                  </a>
                </Button>
              ) : null}
              
              <PromoteButton
                productSlug={product.slug}
                className={product.demo_url ? "flex-1" : "w-full"}
                variant="default"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Empty State Component
  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="p-4 bg-secondary/50 rounded-full mb-4">
        <PackageOpen className="w-12 h-12 text-muted" />
      </div>
      <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted text-center max-w-md">
        {description}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="default" className="px-3 py-1">
              <Globe className="w-3 h-3 mr-2" />
              Marketplace
            </Badge>
          </div>
          <h1 className="text-5xl font-heading font-bold text-foreground mb-4">
            Services to Promote
          </h1>
          <p className="text-xl text-muted max-w-3xl">
            Browse professional website services and start earning commissions on every successful referral
          </p>
        </div>

        {/* Stats Bar */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted mb-1">Total Products</p>
                <p className="text-2xl font-bold text-primary">{products.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted mb-1">Services</p>
                <p className="text-2xl font-bold text-primary">{services.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted mb-1">Templates</p>
                <p className="text-2xl font-bold text-primary">{templates.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted mb-1">Up to</p>
                <p className="text-2xl font-bold text-success">30% Commission</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="space-y-8">
          <Tabs defaultValue="all">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                All Products ({products?.length || 0})
              </TabsTrigger>
              {services.length > 0 && (
                <TabsTrigger value="services" className="flex-1 sm:flex-none">
                  Services ({services.length})
              </TabsTrigger>
            )}
            {templates.length > 0 && (
              <TabsTrigger value="templates" className="flex-1 sm:flex-none">
                Templates ({templates.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* All Products Tab */}
          <TabsContent value="all" className="space-y-4">
            {!products || products.length === 0 ? (
              <EmptyState
                title="No Products Available"
                description="Check back soon for new website services and templates you can promote to earn commissions."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            {services.length === 0 ? (
              <EmptyState
                title="No Services Yet"
                description="Website services will appear here. Check the 'All Products' tab to see all available products."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            {templates.length === 0 ? (
              <EmptyState
                title="No Templates Yet"
                description="Website templates will appear here. Check the 'All Products' tab to see all available products."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        {products && products.length > 0 && (
          <Card className="mt-16 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
                Create your free affiliate account to generate referral links and track your commissions
              </p>
              <Link href="/sign-up">
                <Button size="xl" className="group">
                  Join Affiliate Program
                  <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
