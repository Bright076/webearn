"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageUrl: pathname,
            referrer: document.referrer,
          }),
        });
      } catch (error) {
        // Silently fail - don't break the page
        console.error("Tracking error:", error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null; // This component doesn't render anything
}
