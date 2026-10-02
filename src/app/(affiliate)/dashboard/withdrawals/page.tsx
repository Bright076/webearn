"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageOpen, Wallet, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const withdrawalSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 10;
    },
    { message: "Minimum withdrawal amount is $10" }
  ),
  payoutMethod: z.enum(["usdt", "bank"]),
  // USDT fields
  usdtWalletAddress: z.string().optional(),
  usdtNetwork: z.string().optional(),
  // Bank fields
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
}).refine((data) => {
  if (data.payoutMethod === "usdt") {
    // TRC20 addresses start with T and are 34 characters
    if (!data.usdtWalletAddress) return false;
    const wallet = data.usdtWalletAddress.trim();
    if (data.usdtNetwork === "TRC20") {
      return wallet.startsWith("T") && wallet.length === 34;
    }
    // BEP20 addresses start with 0x and are 42 characters
    if (data.usdtNetwork === "BEP20") {
      return wallet.startsWith("0x") && wallet.length === 42;
    }
    return wallet.length > 20; // Basic validation
  }
  if (data.payoutMethod === "bank") {
    return data.bankName && data.bankAccountNumber && data.bankAccountName;
  }
  return true;
}, {
  message: "Please provide valid payment details for your selected method",
  path: ["payoutMethod"],
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

export default function WithdrawalsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<"usdt" | "bank">("usdt");

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      payoutMethod: "usdt",
      usdtNetwork: "TRC20",
    },
  });

  const amountValue = watch("amount");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Pre-fill payment details from profile
    if (profile) {
      const preferredMethod = profile.preferred_payout_method || "usdt";
      setPayoutMethod(preferredMethod);
      setValue("payoutMethod", preferredMethod);
      
      if (preferredMethod === "usdt") {
        setValue("usdtWalletAddress", profile.usdt_wallet_address || "");
        setValue("usdtNetwork", profile.usdt_network || "TRC20");
      } else {
        setValue("bankName", profile.bank_name || "");
        setValue("bankAccountNumber", profile.bank_account_number || "");
        setValue("bankAccountName", profile.bank_account_name || "");
      }
    }
  }, [profile, setValue]);

  async function fetchData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(profileData);

    // Fetch withdrawals
    const { data: withdrawalsData } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("affiliate_id", user.id)
      .order("created_at", { ascending: false });
    setWithdrawals(withdrawalsData || []);

    // Calculate available balance
    const { data: approvedCommissions } = await supabase
      .from("commissions")
      .select("amount")
      .eq("affiliate_id", user.id)
      .in("status", ["approved", "paid"]);

    const totalApproved =
      approvedCommissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

    const { data: completedWithdrawals } = await supabase
      .from("withdrawals")
      .select("amount")
      .eq("affiliate_id", user.id)
      .eq("status", "completed");

    const totalWithdrawn =
      completedWithdrawals?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

    setAvailableBalance(totalApproved - totalWithdrawn);
  }

  const onSubmit = async (data: WithdrawalFormData) {
    const amount = parseFloat(data.amount);

    // Validate against available balance
    if (amount > availableBalance) {
      setErrorMessage(`Insufficient balance. Available: $${availableBalance.toLocaleString()}`);
      return;
    }

    // Validate payment details based on method
    if (data.payoutMethod === "usdt") {
      if (!data.usdtWalletAddress || data.usdtWalletAddress.trim().length === 0) {
        setErrorMessage("Please provide a valid USDT wallet address");
        return;
      }
    } else {
      if (!data.bankName || !data.bankAccountNumber || !data.bankAccountName) {
        setErrorMessage("Please fill in all bank details");
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Create withdrawal request with snapshot of payment details
    const withdrawalData: any = {
      affiliate_id: user.id,
      amount,
      payout_method: data.payoutMethod,
      status: "pending",
    };

    if (data.payoutMethod === "usdt") {
      withdrawalData.wallet_address = data.usdtWalletAddress;
      withdrawalData.network = data.usdtNetwork;
    } else {
      withdrawalData.bank_snapshot = {
        bank_name: data.bankName,
        bank_account_number: data.bankAccountNumber,
        bank_account_name: data.bankAccountName,
      };
      // Also store in individual columns for backwards compatibility
      withdrawalData.bank_name = data.bankName;
      withdrawalData.bank_account_number = data.bankAccountNumber;
      withdrawalData.bank_account_name = data.bankAccountName;
    }

    const { error } = await supabase.from("withdrawals").insert(withdrawalData);

    setIsLoading(false);

    if (error) {
      console.error("Withdrawal error:", error);
      setErrorMessage("Failed to create withdrawal request. Please try again.");
      return;
    }

    setSuccessMessage("Withdrawal request submitted successfully!");
    setIsOpen(false);
    reset();
    fetchData();

    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPayoutMethodBadge = (method: string) => {
    if (method === "usdt") {
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">USDT</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Bank</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Withdrawals
          </h1>
          <p className="text-muted">Request payouts and track your withdrawal history</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          disabled={availableBalance < 10}
          size="lg"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Request Withdrawal
        </Button>
      </div>

      {/* Available Balance Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 mb-1">Available Balance</p>
            <p className="text-4xl font-heading font-bold">
              ${availableBalance.toLocaleString()}
            </p>
            {availableBalance < 10 && (
              <p className="text-sm text-primary-foreground/80 mt-2">
                Minimum withdrawal: $10
              </p>
            )}
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800">{successMessage}</p>
        </div>
      )}

      {/* Withdrawals Table */}
      {!withdrawals || withdrawals.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12">
          <div className="flex flex-col items-center justify-center">
            <PackageOpen className="w-16 h-16 text-muted mb-4" />
            <p className="text-xl font-semibold text-foreground mb-2">
              No Withdrawals Yet
            </p>
            <p className="text-muted text-center max-w-md mb-6">
              Once you have $10 or more in approved commissions, you can request a withdrawal
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Method
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Payment Details
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(withdrawal.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-foreground">
                        ${Number(withdrawal.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getPayoutMethodBadge(withdrawal.payout_method || "bank")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {withdrawal.payout_method === "usdt" ? (
                          <>
                            <p className="font-semibold text-foreground font-mono text-xs">
                              {withdrawal.wallet_address?.substring(0, 10)}...{withdrawal.wallet_address?.substring(withdrawal.wallet_address.length - 6)}
                            </p>
                            <p className="text-muted">{withdrawal.network || "TRC20"}</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-foreground">
                              {withdrawal.bank_account_name || withdrawal.bank_snapshot?.bank_account_name}
                            </p>
                            <p className="text-muted">
                              {withdrawal.bank_name || withdrawal.bank_snapshot?.bank_name} • {withdrawal.bank_account_number || withdrawal.bank_snapshot?.bank_account_number}
                            </p>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`${getStatusColor(withdrawal.status)} capitalize`}
                        variant="outline"
                      >
                        {withdrawal.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Withdrawal Request Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            <div>
              <Label htmlFor="amount">Withdrawal Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="10.00"
                {...register("amount")}
                className="mt-1.5"
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
              <div className="flex justify-between mt-2">
                <p className="text-xs text-muted">Available: ${availableBalance.toLocaleString()}</p>
                {amountValue && !isNaN(parseFloat(amountValue)) && (
                  <p className="text-xs text-muted">
                    Requesting: ${parseFloat(amountValue).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Payout Method Selection */}
            <div>
              <Label className="mb-3 block">Payout Method</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPayoutMethod("usdt");
                    setValue("payoutMethod", "usdt");
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    payoutMethod === "usdt"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">USDT</span>
                    {payoutMethod === "usdt" && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted">TRC20/BEP20</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPayoutMethod("bank");
                    setValue("payoutMethod", "bank");
                  }}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    payoutMethod === "bank"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">Bank</span>
                    {payoutMethod === "bank" && <Check className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted">Transfer</p>
                </button>
              </div>
            </div>

            <input type="hidden" {...register("payoutMethod")} value={payoutMethod} />

            {/* USDT Fields */}
            {payoutMethod === "usdt" && (
              <div className="space-y-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div>
                  <Label htmlFor="usdtWalletAddress" className="text-xs">
                    USDT Wallet Address *
                  </Label>
                  <Input
                    id="usdtWalletAddress"
                    type="text"
                    placeholder="T... (TRC20) or 0x... (BEP20)"
                    {...register("usdtWalletAddress")}
                    className="mt-1.5 font-mono text-sm"
                  />
                  {errors.usdtWalletAddress && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.usdtWalletAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="usdtNetwork" className="text-xs">Network *</Label>
                  <select
                    id="usdtNetwork"
                    {...register("usdtNetwork")}
                    className="mt-1.5 flex h-9 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                  >
                    <option value="TRC20">TRC20 (TRON) - Lower fees</option>
                    <option value="BEP20">BEP20 (BSC)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Bank Fields */}
            {payoutMethod === "bank" && (
              <div className="space-y-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-muted mb-2">
                  ⚠️ Bank transfers may not be available in all countries
                </p>
                <div>
                  <Label htmlFor="bankName" className="text-xs">Bank Name *</Label>
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="Bank name"
                    {...register("bankName")}
                    className="mt-1.5 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccountNumber" className="text-xs">Account Number *</Label>
                  <Input
                    id="bankAccountNumber"
                    type="text"
                    placeholder="Account number"
                    {...register("bankAccountNumber")}
                    className="mt-1.5 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccountName" className="text-xs">Account Name *</Label>
                  <Input
                    id="bankAccountName"
                    type="text"
                    placeholder="Account holder name"
                    {...register("bankAccountName")}
                    className="mt-1.5 text-sm"
                  />
                </div>
              </div>
            )}

            {errors.payoutMethod && (
              <p className="text-sm text-red-600">{errors.payoutMethod.message}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
