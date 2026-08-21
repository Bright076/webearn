"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUpAction(
  fullName: string,
  email: string,
  password: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Failed to create account" };
  }

  // Check if user has a session (no email confirmation required)
  if (data.session) {
    // User is logged in
    return { success: true };
  }

  // If no session, email confirmation is required
  return {
    message: "Check your email to confirm your account before signing in.",
  };
}
