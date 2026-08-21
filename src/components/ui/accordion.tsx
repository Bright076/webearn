"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  openItem: string | null;
  setOpenItem: (value: string | null) => void;
}>({
  openItem: null,
  setOpenItem: () => {},
});

export function Accordion({ children }: { children: React.ReactNode }) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className="space-y-2">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <div className="border border-border rounded-lg">{children}</div>;
}

export function AccordionTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { openItem, setOpenItem } = React.useContext(AccordionContext);
  const isOpen = openItem === value;

  return (
    <button
      onClick={() => setOpenItem(isOpen ? null : value)}
      className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-secondary transition-colors rounded-lg"
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform",
          isOpen && "transform rotate-180"
        )}
      />
    </button>
  );
}

export function AccordionContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { openItem } = React.useContext(AccordionContext);
  const isOpen = openItem === value;

  if (!isOpen) return null;

  return (
    <div className="px-4 pb-4 text-muted">
      {children}
    </div>
  );
}
