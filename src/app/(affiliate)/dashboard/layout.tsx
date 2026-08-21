import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileMenuButton } from "@/components/MobileMenuButton";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  DollarSign,
  Wallet,
  UserCircle,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user profile
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingBag },
    { href: "/dashboard/leads", label: "Leads", icon: Users },
    { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign },
    { href: "/dashboard/withdrawals", label: "Withdrawals", icon: Wallet },
    { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-sidebar px-4 py-3 flex items-center justify-between border-b border-white/10">
        <Logo variant="light" size="sm" />
        <MobileMenuButton sidebarId="mobile-sidebar" />
      </header>

      {/* Sidebar */}
      <aside id="mobile-sidebar" className="hidden md:flex w-full md:w-64 bg-sidebar flex-shrink-0 flex-col">
        <div className="hidden md:block p-6 border-b border-white/10">
          <Logo variant="light" size="sm" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Desktop Only */}
        <header className="hidden md:block bg-white border-b border-border px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm text-muted">Welcome back</h2>
              <p className="text-lg font-semibold text-foreground">
                {profile?.full_name || profile?.email || "Affiliate"}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
