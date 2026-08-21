import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // If accessing protected routes without authentication
  if ((isDashboardRoute || isAdminRoute) && !user) {
    const redirectUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check user role for authenticated users on protected routes
  if ((isDashboardRoute || isAdminRoute) && user) {
    // Fetch user role
    const { data: userRole, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    console.log("🔍 Middleware Debug:");
    console.log("- User ID:", user.id);
    console.log("- User Email:", user.email);
    console.log("- Role Query Result:", userRole);
    console.log("- Role Query Error:", error);
    console.log("- Current Path:", request.nextUrl.pathname);

    const role = (userRole?.role || "affiliate").toLowerCase();
    console.log("- Determined Role:", role);

    // TEMPORARILY DISABLED - Allow all authenticated users to access both dashboards
    // This lets you access /admin to add products
    // TODO: Fix user_roles table and re-enable this check
    
    // Redirect admin users from /dashboard to /admin
    // if (isDashboardRoute && role === "admin") {
    //   console.log("✅ Redirecting admin from /dashboard to /admin");
    //   const redirectUrl = new URL("/admin", request.url);
    //   return NextResponse.redirect(redirectUrl);
    // }

    // Redirect non-admin users from /admin to /dashboard
    // if (isAdminRoute && role !== "admin") {
    //   console.log("⛔ Redirecting non-admin from /admin to /dashboard");
    //   const redirectUrl = new URL("/dashboard", request.url);
    //   return NextResponse.redirect(redirectUrl);
    // }

    console.log("✅ Allowing access to:", request.nextUrl.pathname);
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
