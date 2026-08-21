"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Copy, Check } from "lucide-react";

interface PromoteButtonProps {
  productSlug: string;
  affiliateCode: string;
  variant?: "default" | "outline";
  className?: string;
}

export function PromoteButton({ productSlug, affiliateCode, variant = "default", className }: PromoteButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handlePromote = () => {
    if (!affiliateCode) {
      addToast("No affiliate code found. Please contact support.", "error");
      return;
    }

    const link = `${window.location.origin}/api/referral?product=${productSlug}&ref=${affiliateCode}`;
    setReferralLink(link);
    setDialogOpen(true);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    addToast("Referral link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={handlePromote}
      >
        Promote
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Referral Link</DialogTitle>
            <DialogDescription>
              Share this link to earn commission on this product
            </DialogDescription>
          </DialogHeader>
          <DialogClose onClick={() => setDialogOpen(false)} />
          <div className="px-6 pb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-secondary/50"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted mt-3">
              Share this link via WhatsApp, social media, or email. You'll earn commission when someone completes a purchase through your link.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
