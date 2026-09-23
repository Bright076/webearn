import { MarketingNav } from "@/components/marketing/nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | WebEarn",
  description: "Get in touch with WebEarn. We're here to help with your website needs or answer questions about our affiliate program.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-muted">Coming soon</p>
      </div>
    </div>
  );
}
