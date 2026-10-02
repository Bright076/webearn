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
  preferredPayoutMethod: z.enum(["usdt", "bank"]),
  // USDT fields
  usdtWalletAddress: z.string().optional(),
  usdtNetwork: z.string().optional(),
  // Bank fields
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
}).refine((data) => {
  // If USDT is preferred, wallet address is required
  if (data.preferredPayoutMethod === "usdt") {
    return data.usdtWalletAddress && data.usdtWalletAddress.length > 0;
  }
  // If Bank is preferred, all bank fields are required
  if (data.preferredPayoutMethod === "bank") {
    return data.bankName && data.bankAccountNumber && data.bankAccountName;
  }
  return true;
}, {
  message: "Please fill in all required payment details for your selected method",
  path: ["preferredPayoutMethod"],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<"usdt" | "bank">("usdt");

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
      const preferredMethod = data.preferred_payout_method || (data.usdt_wallet_address ? "usdt" : "bank");
      setPayoutMethod(preferredMethod);
      reset({
        fullName: data.full_name || "",
        whatsappNumber: data.whatsapp_number || "",
        preferredPayoutMethod: preferredMethod,
        usdtWalletAddress: data.usdt_wallet_address || "",
        usdtNetwork: data.usdt_network || "TRC20",
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
        preferred_payout_method: data.preferredPayoutMethod,
        usdt_wallet_address: data.usdtWalletAddress || null,
        usdt_network: data.usdtNetwork || "TRC20",
        bank_name: data.bankName || null,
        bank_account_number: data.bankAccountNumber || null,
        bank_account_name: data.bankAccountName || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      console.error("Profile update error:", error);
      setErrorMessage(`Failed to update profile: ${error.message}`);
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

          <h3 className="text-lg font-heading font-bold text-foreground mb-2">
            Payout Method
          </h3>
          <p className="text-sm text-muted mb-4">
            Choose how you want to receive your earnings
          </p>

          {/* Payout Method Toggle */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setPayoutMethod("usdt")}
              className={`p-4 rounded-lg border-2 transition-all ${
                payoutMethod === "usdt"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">USDT (TRC20)</span>
                {payoutMethod === "usdt" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted text-left">
                Works worldwide • Instant transfers
              </p>
              <Badge className="mt-2 bg-emerald-100 text-emerald-800 border-emerald-200">
                Recommended
              </Badge>
            </button>

            <button
              type="button"
              onClick={() => setPayoutMethod("bank")}
              className={`p-4 rounded-lg border-2 transition-all ${
                payoutMethod === "bank"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-white hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Bank Transfer</span>
                {payoutMethod === "bank" && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted text-left">
                May not be available in all countries
              </p>
            </button>
          </div>

          <input type="hidden" {...register("preferredPayoutMethod")} value={payoutMethod} />

          {/* USDT Fields */}
          {payoutMethod === "usdt" && (
            <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
              <div>
                <Label htmlFor="usdtWalletAddress">USDT Wallet Address *</Label>
                <Input
                  id="usdtWalletAddress"
                  type="text"
                  placeholder="TRC20 address (starts with T, 34 characters)"
                  {...register("usdtWalletAddress")}
                  className="mt-1.5 font-mono"
                />
                <p className="text-xs text-muted mt-1">
                  Make sure this is a TRC20 (TRON) wallet address
                </p>
                {errors.usdtWalletAddress && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.usdtWalletAddress.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="usdtNetwork">Network</Label>
                <select
                  id="usdtNetwork"
                  {...register("usdtNetwork")}
                  className="mt-1.5 flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  <option value="TRC20">TRC20 (TRON) - Recommended</option>
                  <option value="BEP20">BEP20 (BSC)</option>
                </select>
                <p className="text-xs text-muted mt-1">
                  TRC20 has lower fees and faster transfers
                </p>
              </div>
            </div>
          )}

          {/* Bank Fields */}
          {payoutMethod === "bank" && (
            <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
              <div>
                <Label htmlFor="bankName">Bank Name *</Label>
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

              <div>
                <Label htmlFor="bankAccountNumber">Account Number *</Label>
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

              <div>
                <Label htmlFor="bankAccountName">Account Name *</Label>
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
            </div>
          )}

          {errors.preferredPayoutMethod && (
            <p className="text-sm text-red-600 mt-2">{errors.preferredPayoutMethod.message}</p>
          )}

          <Button type="submit" disabled={isLoading} size="lg" className="w-full">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
