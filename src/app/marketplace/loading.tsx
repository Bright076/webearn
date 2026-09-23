import { MarketingNav } from "@/components/marketing/nav";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-96" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-border rounded-lg overflow-hidden"
            >
              <Skeleton className="w-full h-48" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
