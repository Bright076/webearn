"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { approveCommission, rejectCommission } from "@/lib/actions/commissions";

interface Commission {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  approved_at: string | null;
  rejection_reason: string | null;
  affiliate: {
    id: string;
    full_name: string | null;
    email: string;
    affiliate_code: string | null;
  } | null;
  request: {
    id: string;
    full_name: string;
    website_type: string;
  } | null;
  product: {
    id: string;
    name: string;
  } | null;
}

export function CommissionsTable({ commissions }: { commissions: Commission[] }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pending = commissions.filter((c) => c.status === "pending");
  const approved = commissions.filter((c) => c.status === "approved");
  const paid = commissions.filter((c) => c.status === "paid");
  const rejected = commissions.filter((c) => c.status === "rejected");

  const handleApprove = async (commissionId: string) => {
    setIsSubmitting(true);
    const result = await approveCommission(commissionId);
    if (result.error) {
      alert(result.error);
    } else {
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const handleRejectClick = (commission: Commission) => {
    setSelectedCommission(commission);
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedCommission || !rejectionReason.trim()) {
      alert("Rejection reason is required");
      return;
    }

    setIsSubmitting(true);
    const result = await rejectCommission(selectedCommission.id, rejectionReason);
    if (result.error) {
      alert(result.error);
    } else {
      setRejectDialogOpen(false);
      setRejectionReason("");
      window.location.reload();
    }
    setIsSubmitting(false);
  };

  const renderCommissionsTable = (data: Commission[], showActions = false) => (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Date
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Affiliate
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Client
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Product
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                Amount
              </th>
              {showActions && (
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 6 : 5} className="px-6 py-12 text-center text-muted">
                  No commissions found
                </td>
              </tr>
            ) : (
              data.map((commission) => (
                <tr key={commission.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">
                    {new Date(commission.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {commission.affiliate?.full_name || "N/A"}
                      </p>
                      <p className="text-xs text-muted">{commission.affiliate?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {commission.request?.full_name || "N/A"}
                      </p>
                      <p className="text-xs text-muted">
                        {commission.request?.website_type || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {commission.product?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    ${Number(commission.amount).toLocaleString()}
                  </td>
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(commission.id)}
                          disabled={isSubmitting}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectClick(commission)}
                          disabled={isSubmitting}
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-900">{pending.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-1">Approved</p>
          <p className="text-2xl font-bold text-blue-900">{approved.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-800 mb-1">Paid</p>
          <p className="text-2xl font-bold text-emerald-900">{paid.length}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{rejected.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paid.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {renderCommissionsTable(pending, true)}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {renderCommissionsTable(approved)}
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          {renderCommissionsTable(paid)}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {renderCommissionsTable(rejected)}
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Commission</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-6">
            <p className="text-sm text-muted">
              Please provide a reason for rejecting this commission:
            </p>

            <div>
              <Label htmlFor="reason">Rejection Reason *</Label>
              <textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Client refund issued, duplicate entry, incorrect amount..."
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
                {isSubmitting ? "Rejecting..." : "Reject Commission"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
