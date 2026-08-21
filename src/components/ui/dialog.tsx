"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-lg w-full max-w-md mx-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="px-6 pt-6 pb-4">{children}</div>;
}

export function DialogTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-xl font-heading font-semibold text-foreground">
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-sm text-muted mt-2">{children}</p>;
}

export function DialogClose({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
