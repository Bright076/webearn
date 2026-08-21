"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Copy, Check } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  whatsappNumber: z.string().min(10, "Valid WhatsApp number is required"),
  bankName: z.string().min(2, "Bank name is required"),
  bankAccountNumber: z.string().min(10, "Valid account number is required"),
  bankAccountName: z.string().min(2, "Account name is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      reset({
        fullName: data.full_name || "",
        whatsappNumber: data.whatsapp_number || "",
        bankName: data.bank_name || "",
        bankAccountNumber: data.bank_account_number || "",
        bankAccountName: data.bank_account_name || "",
      });
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        whatsapp_number: data.whatsappNumber,
        bank_name: data.bankName,
        bank_account_number: data.bankAccountNumber,
        bank_account_name: data.bankAccountName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      setErrorMessage("Failed to update profile");
      return;
    }

    setSuccessMessage("Profile updated successfully!");
    fetchProfile();

    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const copyAffiliateCode = () => {
    if (profile?.affiliate_code) {
      navigator.clipboard.writeText(profile.affiliate_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Profile Settings
        </h1>
        <p className="text-muted">
          Update your personal information and payment details
        </p>
      </div>

      {/* Affiliate Code Card */}
      {profile?.affiliate_code && (
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">
                Your Affiliate Code
              </h3>
              <p className="text-sm text-muted">
                This is your unique identifier for referral tracking
              </p>
            </div>
            <Badge className="bg-primary text-white">Active</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-border rounded-lg px-4 py-3">
              <code className="text-lg font-mono font-bold text-foreground">
                {profile.affiliate_code}
              </code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAffiliateCode}
              className="flex-shrink-0"
            >
              {copiedCode ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="text-xl font-heading font-bold text-foreground mb-6">
          Personal Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register("fullName")}
              className="mt-1.5"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email (Read Only) */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ""}
              disabled
              className="mt-1.5 bg-secondary/50"
            />
            <p className="text-xs text-muted mt-1">Email cannot be changed</p>
          </div>

          {/* WhatsApp Number */}
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              type="tel"
              placeholder="+234 800 000 0000"
              {...register("whatsappNumber")}
              className="mt-1.5"
            />
            {errors.whatsappNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.whatsappNumber.message}</p>
            )}
          </div>

          <div className="border-t border-border my-6" />

          <h3 className="text-lg font-heading font-bold text-foreground mb-4">
            Bank Details
          </h3>
          <p className="text-sm text-muted mb-4">
            Required for withdrawal payments. All fields must be filled.
          </p>

          {/* Bank Name */}
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              type="text"
              placeholder="e.g. First Bank, GT Bank, Access Bank"
              {...register("bankName")}
              className="mt-1.5"
            />
            {errors.bankName && (
              <p className="text-sm text-red-600 mt-1">{errors.bankName.message}</p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <Label htmlFor="bankAccountNumber">Account Number</Label>
            <Input
              id="bankAccountNumber"
              type="text"
              placeholder="0123456789"
              {...register("bankAccountNumber")}
              className="mt-1.5"
            />
            {errors.bankAccountNumber && (
              <p className="text-sm text-red-600 mt-1">
                {errors.bankAccountNumber.message}
              </p>
            )}
          </div>

          {/* Account Name */}
          <div>
            <Label htmlFor="bankAccountName">Account Name</Label>
            <Input
              id="bankAccountName"
              type="text"
              placeholder="Account name as it appears on your bank account"
              {...register("bankAccountName")}
              className="mt-1.5"
            />
            {errors.bankAccountName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.bankAccountName.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} size="lg" className="w-full">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
