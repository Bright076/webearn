"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageOpen, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const withdrawalSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 50;
    },
    { message: "Minimum withdrawal amount is $50" }
  ),
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

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
  });

  const amountValue = watch("amount");

  useEffect(() => {
    fetchData();
  }, []);

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

  const onSubmit = async (data: WithdrawalFormData) => {
    const amount = parseFloat(data.amount);

    // Validate against available balance
    if (amount > availableBalance) {
      setErrorMessage(`Insufficient balance. Available: $${availableBalance.toLocaleString()}`);
      return;
    }

    // Check if profile has bank details
    if (
      !profile?.bank_account_name ||
      !profile?.bank_account_number ||
      !profile?.bank_name
    ) {
      setErrorMessage("Please update your bank details in your profile first");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Create withdrawal request
    const { error } = await supabase.from("withdrawals").insert({
      affiliate_id: user.id,
      amount,
      bank_account_name: profile.bank_account_name,
      bank_account_number: profile.bank_account_number,
      bank_name: profile.bank_name,
      status: "pending",
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage("Failed to create withdrawal request");
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
          disabled={availableBalance < 5000}
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
            {availableBalance < 50 && (
              <p className="text-sm text-primary-foreground/80 mt-2">
                Minimum withdrawal: $50
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
              Once you have $50 or more in approved commissions, you can request a withdrawal
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
                    Date Requested
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Bank Details
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
                      <div className="text-sm">
                        <p className="font-semibold text-foreground">
                          {withdrawal.bank_account_name}
                        </p>
                        <p className="text-muted">
                          {withdrawal.bank_name} • {withdrawal.bank_account_number}
                        </p>
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
        <DialogContent>
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
              <Label htmlFor="amount">Withdrawal Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="5000"
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

            {profile && (
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Payment will be sent to:
                </p>
                <p className="text-sm text-foreground">{profile.bank_account_name}</p>
                <p className="text-sm text-muted">
                  {profile.bank_name} • {profile.bank_account_number}
                </p>
              </div>
            )}

            <div className="flex gap-3">
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
