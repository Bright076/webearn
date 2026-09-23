import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Professional Website | WebEarn",
  description: "Tell us about your project and get a custom quote for your professional website. Fast delivery, transparent pricing, and expert support.",
};

export default function GetAWebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
