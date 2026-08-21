"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  approveWithdrawal,
  markWithdrawalPaid,
  rejectWithdrawal,
} from "@/lib/actions/withdrawals";

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at: string | null;
  rejection_reason: string | null;
  bank_snapshot: {
    bank_name: string;
    account_number: string;
    account_name: string;
  } | null;
  affiliate: {
    id: string;
    full_name: string | null;
    email: string;
    affiliate_code: string | null;
  } | null;
}

export function WithdrawalsTable({ withdrawals }: { withdrawals: Withdrawal[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const all = withdrawals;
  const pending = withdrawals.filter((w) => w.status === "pending");
  const approved = withdrawals.filter((w) => w.status === "approved");
  const paid = withdrawals.filter((w) => w.status === "paid");
  const rejected = withdrawals.filter((w) => w.status === "rejected");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApprove = async (withdrawalId: string) => {
    if (!confirm("Approve this withdrawal request?")) return;
    setIsSubmitting(true);
    const result = await approveWithdrawal(withdrawalId);
    if (result.error) {
      alert(result.error);
    } else {
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const handleMarkPaid = async (withdrawalId: string) => {
    if (!confirm("Confirm that payment has been sent to the affiliate's bank account?")) return;
    setIsSubmitting(true);
    const result = await markWithdrawalPaid(withdrawalId);
    if (result.error) {
      alert(result.error);
    } else {
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const handleRejectClick = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedWithdrawal || !rejectionReason.trim()) {
      alert("Rejection reason is required");
      return;
    }

    setIsSubmitting(true);
    const result = await rejectWithdrawal(selectedWithdrawal.id, rejectionReason);
    if (result.error) {
      alert(result.error);
    } else {
      setRejectDialogOpen(false);
      setRejectionReason("");
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const renderWithdrawalsTable = (data: Withdrawal[]) => (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground w-8"></th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Date
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Affiliate
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                Amount
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted">
                  No withdrawals found
                </td>
              </tr>
            ) : (
              data.map((withdrawal) => (
                <>
                  <tr
                    key={withdrawal.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setExpandedRow(expandedRow === withdrawal.id ? null : withdrawal.id)
                        }
                        className="text-muted hover:text-foreground"
                      >
                        {expandedRow === withdrawal.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {withdrawal.affiliate?.full_name || "N/A"}
                        </p>
                        <p className="text-xs text-muted">
                          Code: {withdrawal.affiliate?.affiliate_code}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      ${Number(withdrawal.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {withdrawal.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(withdrawal.id)}
                              disabled={isSubmitting}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectClick(withdrawal)}
                              disabled={isSubmitting}
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {withdrawal.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkPaid(withdrawal.id)}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark as Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === withdrawal.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-secondary/10">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Bank Details</h4>
                          {withdrawal.bank_snapshot ? (
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted">Bank Name</p>
                                <p className="font-semibold">
                                  {withdrawal.bank_snapshot.bank_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted">Account Number</p>
                                <p className="font-semibold">
                                  {withdrawal.bank_snapshot.account_number}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted">Account Name</p>
                                <p className="font-semibold">
                                  {withdrawal.bank_snapshot.account_name}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted">No bank details available</p>
                          )}
                          {withdrawal.rejection_reason && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-red-800 mb-1">
                                Rejection Reason
                              </h4>
                              <p className="text-sm text-red-700">
                                {withdrawal.rejection_reason}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({all.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderWithdrawalsTable(all)}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {renderWithdrawalsTable(pending)}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {renderWithdrawalsTable(approved)}
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          {renderWithdrawalsTable(paid)}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {renderWithdrawalsTable(rejected)}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            <p className="text-sm text-muted">
              Please provide a reason for rejecting this withdrawal:
            </p>

            <div>
              <Label htmlFor="reason">Rejection Reason *</Label>
              <textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incorrect bank details, amount dispute, pending investigation..."
                className="mt-1.5 flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm min-h-[100px]"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false);
                  setRejectionReason("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectSubmit}
                disabled={isSubmitting || !rejectionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Rejecting..." : "Reject Withdrawal"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
