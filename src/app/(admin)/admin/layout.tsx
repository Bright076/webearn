import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SignOutButton } from "@/components/SignOutButton";
import { MobileMenuButton } from "@/components/MobileMenuButton";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  DollarSign,
  Wallet,
  Settings,
} from "lucide-react";

export default async function AdminLayout({
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

  // Check if user is admin
  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userRole?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch admin profile
  const { data: profile } = await adminClient
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/requests", label: "Client Requests", icon: FileText },
    { href: "/admin/affiliates", label: "Affiliates", icon: Users },
    { href: "/admin/commissions", label: "Commissions", icon: DollarSign },
    { href: "/admin/withdrawals", label: "Withdrawals", icon: Wallet },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-sidebar px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div>
          <Logo variant="light" size="sm" />
          <p className="text-xs text-white/60 mt-1">Admin Panel</p>
        </div>
        <MobileMenuButton sidebarId="admin-mobile-sidebar" />
      </header>

      {/* Sidebar */}
      <aside id="admin-mobile-sidebar" className="hidden md:flex w-full md:w-64 bg-sidebar flex-shrink-0 flex-col">
        <div className="hidden md:block p-6 border-b border-white/10">
          <Logo variant="light" size="sm" />
          <p className="text-xs text-white/60 mt-2">Admin Panel</p>
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
              <h2 className="text-sm text-muted">Admin Panel</h2>
              <p className="text-lg font-semibold text-foreground">
                {profile?.full_name || profile?.email || "Administrator"}
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
