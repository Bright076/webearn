"use server";

import { createClient } from "@/lib/supabase/server";

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

  // Return success - client will handle redirect
  return { success: true };
}
