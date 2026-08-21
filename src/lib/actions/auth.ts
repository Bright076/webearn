"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
  // Sign out will be handled client-side for speed
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getCurrentUser() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserRole(userId: string) {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  return data?.role || null;
}
