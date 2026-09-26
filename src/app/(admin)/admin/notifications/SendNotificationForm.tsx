"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Affiliate {
  id: string;
  full_name: string | null;
  email: string;
  affiliate_code: string | null;
}

export function SendNotificationForm({ affiliates }: { affiliates: Affiliate[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    recipients: "all" as "all" | "specific",
    selectedAffiliates: [] as string[],
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
    link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Determine recipient IDs
      const recipientIds =
        formData.recipients === "all"
          ? affiliates.map((a) => a.id)
          : formData.selectedAffiliates;

      if (recipientIds.length === 0) {
        setErrorMessage("Please select at least one recipient");
        setIsSubmitting(false);
        return;
      }

      // Create notifications for each recipient
      const notifications = recipientIds.map((userId) => ({
        user_id: userId,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        link: formData.link || null,
      }));

      const { error } = await supabase.from("notifications").insert(notifications);

      if (error) {
        setErrorMessage("Failed to send notifications: " + error.message);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        `Successfully sent notification to ${recipientIds.length} affiliate${
          recipientIds.length > 1 ? "s" : ""
        }!`
      );

      // Reset form
      setFormData({
        recipients: "all",
        selectedAffiliates: [],
        title: "",
        message: "",
        type: "info",
        link: "",
      });

      router.refresh();
    } catch (error) {
      setErrorMessage("An error occurred while sending notifications");
    }

    setIsSubmitting(false);
  };

  const handleAffiliateToggle = (id: string) => {
    if (formData.selectedAffiliates.includes(id)) {
      setFormData({
        ...formData,
        selectedAffiliates: formData.selectedAffiliates.filter((a) => a !== id),
      });
    } else {
      setFormData({
        ...formData,
        selectedAffiliates: [...formData.selectedAffiliates, id],
      });
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6 max-w-4xl">
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-800 font-semibold">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipients */}
        <div>
          <Label className="mb-3 block">Recipients</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.recipients === "all"}
                onChange={() =>
                  setFormData({ ...formData, recipients: "all", selectedAffiliates: [] })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">
                All Affiliates ({affiliates.length})
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.recipients === "specific"}
                onChange={() => setFormData({ ...formData, recipients: "specific" })}
                className="w-4 h-4"
              />
              <span className="text-sm">Specific Affiliates</span>
            </label>
          </div>

          {formData.recipients === "specific" && (
            <div className="mt-4 max-h-60 overflow-y-auto border border-border rounded-lg p-4 space-y-2">
              {affiliates.map((affiliate) => (
                <label key={affiliate.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.selectedAffiliates.includes(affiliate.id)}
                    onChange={() => handleAffiliateToggle(affiliate.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    {affiliate.full_name || affiliate.email} ({affiliate.affiliate_code})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Notification Type */}
        <div>
          <Label htmlFor="type">Notification Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "info" | "success" | "warning" | "error",
              })
            }
            className="mt-1.5 w-full h-10 px-3 py-2 text-sm border border-border rounded-lg bg-white"
          >
            <option value="info">Info (Blue)</option>
            <option value="success">Success (Green)</option>
            <option value="warning">Warning (Yellow)</option>
            <option value="error">Error (Red)</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., New Product Launch!"
            required
            className="mt-1.5"
          />
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">Message *</Label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter your message here..."
            required
            rows={4}
            className="mt-1.5 w-full px-3 py-2 text-sm border border-border rounded-lg bg-white resize-none"
          />
        </div>

        {/* Link (Optional) */}
        <div>
          <Label htmlFor="link">Link (Optional)</Label>
          <Input
            id="link"
            type="text"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="/dashboard/marketplace"
            className="mt-1.5"
          />
          <p className="text-xs text-muted mt-1">
            Add a link to direct affiliates to a specific page (e.g., /dashboard/marketplace)
          </p>
        </div>

        {/* Preview */}
        <div>
          <Label className="mb-2 block">Preview</Label>
          <div
            className={`rounded-lg p-4 border-l-4 ${
              formData.type === "success"
                ? "border-emerald-500 bg-emerald-50"
                : formData.type === "error"
                ? "border-red-500 bg-red-50"
                : formData.type === "warning"
                ? "border-amber-500 bg-amber-50"
                : "border-blue-500 bg-blue-50"
            }`}
          >
            <h4 className="font-semibold text-foreground text-sm mb-1">
              {formData.title || "Notification Title"}
            </h4>
            <p className="text-sm text-foreground/80">
              {formData.message || "Your notification message will appear here..."}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
          {isSubmitting ? "Sending..." : "Send Notification"}
        </Button>
      </form>
    </div>
  );
}
