"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="default"
      size="sm"
      className="w-full"
      onClick={handleCopy}
    >
      {copied ? "✓ Copied!" : "📋 Copy Link"}
    </Button>
  );
}
