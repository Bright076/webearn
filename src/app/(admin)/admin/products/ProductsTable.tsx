"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from "@/lib/actions/products";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  commissionType: z.enum(["fixed", "percentage"]),
  commissionValue: z.string().min(1, "Commission value is required"),
  deliveryDays: z.string().optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().optional(), // Changed from url() to allow file uploads
  isActive: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  commission_type: "fixed" | "percentage";
  commission_value: number;
  delivery_days: number | null;
  demo_url: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  description: string | null;
  product_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      commissionType: "fixed",
    },
  });

  const watchName = watch("name");
  const watchCategoryId = watch("categoryId");

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setThumbnailFile(null);
    setThumbnailPreview("");
    reset({
      name: "",
      slug: "",
      categoryId: "",
      description: "",
      price: "",
      commissionType: "fixed",
      commissionValue: "",
      deliveryDays: "",
      demoUrl: "",
      thumbnailUrl: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setThumbnailFile(null);
    setThumbnailPreview(product.thumbnail_url || "");
    reset({
      name: product.name,
      slug: product.slug,
      categoryId: product.product_categories?.id || "",
      description: product.description || "",
      price: product.price.toString(),
      commissionType: product.commission_type,
      commissionValue: product.commission_value.toString(),
      deliveryDays: product.delivery_days?.toString() || "",
      demoUrl: product.demo_url || "",
      thumbnailUrl: product.thumbnail_url || "",
      isActive: product.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadThumbnail = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `product-thumbnails/${fileName}`;

      // Upload to Supabase Storage
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    // Upload thumbnail if a new file was selected
    let thumbnailUrl = data.thumbnailUrl;
    if (thumbnailFile) {
      const uploadedUrl = await uploadThumbnail(thumbnailFile);
      if (uploadedUrl) {
        thumbnailUrl = uploadedUrl;
      } else {
        setErrorMessage("Failed to upload thumbnail image");
        setIsSubmitting(false);
        return;
      }
    }

    const formData = {
      name: data.name,
      slug: data.slug || generateSlug(data.name),
      categoryId: data.categoryId,
      description: data.description,
      price: parseFloat(data.price),
      commissionType: data.commissionType,
      commissionValue: parseFloat(data.commissionValue),
      deliveryDays: data.deliveryDays ? parseInt(data.deliveryDays) : undefined,
      demoUrl: data.demoUrl,
      thumbnailUrl: thumbnailUrl,
      isActive: data.isActive,
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
    } else {
      result = await createProduct(formData);
    }

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setSuccessMessage(
      editingProduct ? "Product updated successfully!" : "Product created successfully!"
    );
    setIsDialogOpen(false);
    setTimeout(() => {
      setSuccessMessage("");
      window.location.reload();
    }, 1500);
  };

  const handleToggleActive = async (product: Product) => {
    const result = await toggleProductActive(product.id, !product.is_active);
    if (result.error) {
      alert(result.error);
    } else {
      window.location.reload();
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    const result = await deleteProduct(productToDelete.id);
    setDeleteDialogOpen(false);

    if (result.error) {
      alert(result.error);
    } else {
      window.location.reload();
    }
  };

  const selectedCategory = categories.find((c) => c.id === watchCategoryId);
  const showDemoUrl = selectedCategory?.slug === "website-templates";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted">
            Total: <span className="font-semibold">{products.length}</span> products
          </p>
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800">{successMessage}</p>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                  Category
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                  Commission
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.thumbnail_url ? (
                        <img
                          src={product.thumbnail_url}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-secondary/50 rounded-lg border border-border flex items-center justify-center">
                          <span className="text-xs text-muted">No image</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-muted">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.product_categories?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    ${product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {product.commission_type === "fixed"
                      ? `$${product.commission_value.toLocaleString()}`
                      : `${product.commission_value}%`}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                      className={
                        product.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(product)}
                        title={product.is_active ? "Deactivate" : "Activate"}
                      >
                        {product.is_active ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g. Business Website"
                  className="mt-1.5"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="slug">Slug (auto-generated)</Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder={watchName ? generateSlug(watchName) : "auto-generated"}
                  className="mt-1.5"
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="categoryId">Category *</Label>
                <select
                  id="categoryId"
                  {...register("categoryId")}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={3}
                  placeholder="Product description..."
                  className="mt-1.5 flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price")}
                  placeholder="500"
                  className="mt-1.5"
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="deliveryDays">Delivery (days)</Label>
                <Input
                  id="deliveryDays"
                  type="number"
                  {...register("deliveryDays")}
                  placeholder="7"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="commissionType">Commission Type *</Label>
                <select
                  id="commissionType"
                  {...register("commissionType")}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <Label htmlFor="commissionValue">Commission Value *</Label>
                <Input
                  id="commissionValue"
                  type="number"
                  step="0.01"
                  {...register("commissionValue")}
                  placeholder="150 or 30"
                  className="mt-1.5"
                />
                {errors.commissionValue && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.commissionValue.message}
                  </p>
                )}
              </div>

              {showDemoUrl && (
                <div className="col-span-2">
                  <Label htmlFor="demoUrl">Demo URL</Label>
                  <Input
                    id="demoUrl"
                    type="url"
                    {...register("demoUrl")}
                    placeholder="https://demo.example.com"
                    className="mt-1.5"
                  />
                  {errors.demoUrl && (
                    <p className="text-sm text-red-600 mt-1">{errors.demoUrl.message}</p>
                  )}
                </div>
              )}

              <div className="col-span-2">
                <Label htmlFor="thumbnail">Product Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted mt-1">
                  Upload an image (JPG, PNG, or WebP recommended)
                </p>
                {thumbnailPreview && (
                  <div className="mt-3">
                    <p className="text-sm text-muted mb-2">Preview:</p>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Active (visible to affiliates)</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? "Saving..."
                  : editingProduct
                  ? "Update Product"
                  : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"?
              <br />
              <br />
              <strong className="text-amber-600">
                Warning: Existing referral links for this product will stop working if deleted.
              </strong>
              <br />
              <br />
              Consider toggling it to "Inactive" instead if it has related client requests.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
