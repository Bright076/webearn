"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createProduct(formData: {
  name: string;
  slug?: string;
  categoryId: string;
  description?: string;
  price: number;
  commissionType: "fixed" | "percentage";
  commissionValue: number;
  deliveryDays?: number;
  demoUrl?: string;
  thumbnailUrl?: string;
  isActive: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify admin role
  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userRole?.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  // Generate slug if not provided
  const slug = formData.slug || slugify(formData.name);

  const { error } = await adminClient.from("products").insert({
    name: formData.name,
    slug,
    category_id: formData.categoryId,
    description: formData.description || null,
    price: formData.price,
    commission_type: formData.commissionType,
    commission_value: formData.commissionValue,
    delivery_days: formData.deliveryDays || null,
    demo_url: formData.demoUrl || null,
    thumbnail_url: formData.thumbnailUrl || null,
    is_active: formData.isActive,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
  revalidatePath("/dashboard/marketplace");

  return { success: true };
}

export async function updateProduct(
  productId: string,
  formData: {
    name: string;
    slug: string;
    categoryId: string;
    description?: string;
    price: number;
    commissionType: "fixed" | "percentage";
    commissionValue: number;
    deliveryDays?: number;
    demoUrl?: string;
    thumbnailUrl?: string;
    isActive: boolean;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify admin role
  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userRole?.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  const { error } = await adminClient
    .from("products")
    .update({
      name: formData.name,
      slug: formData.slug,
      category_id: formData.categoryId,
      description: formData.description || null,
      price: formData.price,
      commission_type: formData.commissionType,
      commission_value: formData.commissionValue,
      delivery_days: formData.deliveryDays || null,
      demo_url: formData.demoUrl || null,
      thumbnail_url: formData.thumbnailUrl || null,
      is_active: formData.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
  revalidatePath("/dashboard/marketplace");

  return { success: true };
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userRole?.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  const { error } = await adminClient
    .from("products")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
  revalidatePath("/dashboard/marketplace");

  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const adminClient = createAdminClient();
  const { data: userRole } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userRole?.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  // Check if product has related client requests
  const { count } = await adminClient
    .from("client_requests")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  if (count && count > 0) {
    return {
      error: `This product has ${count} related client request(s). Consider toggling it inactive instead of deleting.`,
    };
  }

  const { error } = await adminClient.from("products").delete().eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/marketplace");
  revalidatePath("/dashboard/marketplace");

  return { success: true };
}
