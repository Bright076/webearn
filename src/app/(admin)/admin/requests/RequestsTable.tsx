"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { updateRequestStatus, updateRequestNotes } from "@/lib/actions/requests";
import { useRouter } from "next/navigation";

interface Request {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  whatsapp: string;
  message: string | null;
  status: string;
  admin_notes: string | null;
  affiliate_id: string | null;
  products: {
    id: string;
    name: string;
    slug: string;
  } | null;
  profiles: {
    id: string;
    full_name: string | null;
    affiliate_code: string | null;
  } | null;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-800" },
  { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-800" },
  { value: "negotiating", label: "Negotiating", color: "bg-purple-100 text-purple-800" },
  { value: "paid", label: "Paid", color: "bg-emerald-100 text-emerald-800" },
  { value: "in_progress", label: "In Progress", color: "bg-cyan-100 text-cyan-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export function RequestsTable({ requests }: { requests: Request[] }) {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [affiliateFilter, setAffiliateFilter] = useState("all");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== "all" && req.status !== statusFilter) return false;
    if (affiliateFilter === "has_affiliate" && !req.affiliate_id) return false;
    if (affiliateFilter === "direct" && req.affiliate_id) return false;
    return true;
  });

  const handleRowClick = (request: Request) => {
    setSelectedRequest(request);
    setNotes(request.admin_notes || "");
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedRequest) return;

    setIsUpdatingStatus(true);
    const result = await updateRequestStatus(
      selectedRequest.id,
      newStatus,
      selectedRequest.status
    );
    setIsUpdatingStatus(false);

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    // Handle commission creation notifications
    if (result.commissionCreated) {
      showToast(
        `Status updated to ${newStatus}. Commission created for ${result.affiliateCode}!`,
        "success"
      );
    } else if (result.commissionExists) {
      showToast(`Status updated to ${newStatus}. Commission already exists.`, "info");
    } else if (result.noAffiliate) {
      showToast(`Status updated to ${newStatus}. No affiliate - no commission created.`, "info");
    } else {
      showToast(`Status updated to ${newStatus} successfully.`, "success");
    }

    // Update local state
    setSelectedRequest({ ...selectedRequest, status: newStatus });
    router.refresh();
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;

    setIsSavingNotes(true);
    const result = await updateRequestNotes(selectedRequest.id, notes);
    setIsSavingNotes(false);

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    showToast("Notes saved successfully", "success");
    setSelectedRequest({ ...selectedRequest, admin_notes: notes });
    router.refresh();
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return (
      <Badge className={statusOption?.color || "bg-gray-100 text-gray-800"}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <p className="font-semibold">{toast.message}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-white border border-border rounded-lg p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <Label className="text-sm mb-2 block">Status</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 py-2 text-sm border border-border rounded-lg bg-white"
              >
                <option value="all">All Statuses</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Affiliate Type</Label>
              <select
                value={affiliateFilter}
                onChange={(e) => setAffiliateFilter(e.target.value)}
                className="h-10 px-3 py-2 text-sm border border-border rounded-lg bg-white"
              >
                <option value="all">All</option>
                <option value="has_affiliate">Has Affiliate</option>
                <option value="direct">Direct Only</option>
              </select>
            </div>

            <div className="flex items-end">
              <p className="text-sm text-muted">
                Showing <span className="font-semibold">{filteredRequests.length}</span> of{" "}
                <span className="font-semibold">{requests.length}</span> requests
              </p>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white border border-border rounded-lg p-12 text-center">
            <p className="text-muted mb-2">No requests found</p>
            <p className="text-sm text-muted">
              {requests.length === 0
                ? "No client requests yet. Waiting for the first inquiry."
                : "Try adjusting your filters."}
            </p>
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
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Client Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      WhatsApp
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Product
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Affiliate
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() => handleRowClick(request)}
                      className="hover:bg-secondary/30 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-foreground">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground">{request.full_name}</p>
                          <p className="text-sm text-muted">{request.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{request.whatsapp}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {request.products?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {request.profiles?.affiliate_code ? (
                          <Badge className="bg-primary/10 text-primary">
                            {request.profiles.affiliate_code}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Direct</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {isDrawerOpen && selectedRequest && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseDrawer}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground">
                    Request Details
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    {formatDate(selectedRequest.created_at)}
                  </p>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client Info */}
              <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-foreground">Client Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted">Name</p>
                    <p className="font-semibold text-foreground">{selectedRequest.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted">WhatsApp</p>
                    <p className="font-semibold text-foreground">{selectedRequest.whatsapp}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted">Email</p>
                    <p className="font-semibold text-foreground">{selectedRequest.email}</p>
                  </div>
                </div>
              </div>

              {/* Product & Affiliate Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted mb-1">Product</p>
                  <p className="font-semibold text-foreground">
                    {selectedRequest.products?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">Affiliate</p>
                  {selectedRequest.profiles?.affiliate_code ? (
                    <div>
                      <Badge className="bg-primary/10 text-primary mb-1">
                        {selectedRequest.profiles.affiliate_code}
                      </Badge>
                      <p className="text-sm text-foreground">
                        {selectedRequest.profiles.full_name || "N/A"}
                      </p>
                    </div>
                  ) : (
                    <Badge variant="secondary">Direct (No Affiliate)</Badge>
                  )}
                </div>
              </div>

              {/* Client Message */}
              {selectedRequest.message && (
                <div>
                  <p className="text-sm text-muted mb-2">Client Message</p>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Management */}
              <div>
                <Label htmlFor="status" className="mb-2 block">
                  Status
                </Label>
                <select
                  id="status"
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdatingStatus}
                  className="w-full h-10 px-3 py-2 text-sm border border-border rounded-lg bg-white disabled:opacity-50"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {isUpdatingStatus && (
                  <p className="text-sm text-muted mt-1">Updating status...</p>
                )}
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="notes" className="mb-2 block">
                  Admin Notes (Internal)
                </Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Add internal notes about this request..."
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white resize-none"
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="mt-2"
                  size="sm"
                >
                  {isSavingNotes ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
