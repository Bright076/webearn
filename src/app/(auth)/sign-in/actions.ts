"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function signInAction(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Failed to sign in" };
  }

  // Check if user is admin
  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .single();

  const isAdmin = userRole?.role === "admin";

  // Return success with role info
  return { 
    success: true,
    isAdmin: isAdmin,
    redirectTo: isAdmin ? "/admin" : "/dashboard"
  };
}
