"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Ban, CheckCircle } from "lucide-react";
import { toggleAffiliateStatus } from "@/lib/actions/affiliates";

interface Affiliate {
  id: string;
  full_name: string | null;
  email: string;
  affiliate_code: string | null;
  status: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  created_at: string;
  totalLeads: number;
  totalCommission: number;
}

export function AffiliatesTable({ affiliates }: { affiliates: Affiliate[] }) {
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleViewDetails = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (affiliateId: string, currentStatus: string | null) => {
    setIsUpdating(true);
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    const result = await toggleAffiliateStatus(affiliateId, newStatus);
    
    if (result.error) {
      alert(result.error);
    } else {
      window.location.reload();
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted">
          Total: <span className="font-semibold">{affiliates.length}</span> affiliates
        </p>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                  Affiliate Code
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                  Leads
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                  Total Commission
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
              {affiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">
                      {affiliate.full_name || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {affiliate.email}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-secondary/50 px-2 py-1 rounded">
                      {affiliate.affiliate_code || "N/A"}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    {affiliate.totalLeads}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-foreground">
                    ${affiliate.totalCommission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={affiliate.status === "suspended" ? "secondary" : "default"}
                      className={
                        affiliate.status === "suspended"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }
                    >
                      {affiliate.status === "suspended" ? "Suspended" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(affiliate)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(affiliate.id, affiliate.status)}
                        disabled={isUpdating}
                        title={affiliate.status === "suspended" ? "Reactivate" : "Suspend"}
                      >
                        {affiliate.status === "suspended" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Ban className="w-4 h-4 text-red-600" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Affiliate Details</DialogTitle>
          </DialogHeader>

          {selectedAffiliate && (
            <div className="space-y-6 p-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted">Full Name</p>
                    <p className="font-semibold">{selectedAffiliate.full_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted">Email</p>
                    <p className="font-semibold">{selectedAffiliate.email}</p>
                  </div>
                  <div>
                    <p className="text-muted">Affiliate Code</p>
                    <code className="bg-secondary/50 px-2 py-1 rounded">
                      {selectedAffiliate.affiliate_code || "N/A"}
                    </code>
                  </div>
                  <div>
                    <p className="text-muted">Status</p>
                    <Badge
                      className={
                        selectedAffiliate.status === "suspended"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }
                    >
                      {selectedAffiliate.status === "suspended" ? "Suspended" : "Active"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Performance Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="text-sm text-muted mb-1">Total Leads</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedAffiliate.totalLeads}
                    </p>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="text-sm text-muted mb-1">Total Commission</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${selectedAffiliate.totalCommission.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Bank Details</h3>
                {selectedAffiliate.bank_name ? (
                  <div className="bg-secondary/20 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Bank Name:</span>
                      <span className="font-semibold">{selectedAffiliate.bank_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Account Number:</span>
                      <span className="font-semibold">{selectedAffiliate.bank_account_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Account Name:</span>
                      <span className="font-semibold">{selectedAffiliate.bank_account_name}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted">No bank details on file</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleToggleStatus(selectedAffiliate.id, selectedAffiliate.status)}
                  disabled={isUpdating}
                  variant={selectedAffiliate.status === "suspended" ? "default" : "outline"}
                  className="flex-1"
                >
                  {isUpdating
                    ? "Updating..."
                    : selectedAffiliate.status === "suspended"
                    ? "Reactivate Affiliate"
                    : "Suspend Affiliate"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
