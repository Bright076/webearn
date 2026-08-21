"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
}

export function Logo({ className = "", size = "md", variant = "dark" }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 53 },
    lg: { width: 200, height: 66 },
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const textColor = variant === "light" ? "text-white" : "text-primary";

  const dimensions = sizes[size];

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {!imageError ? (
        <Image
          src="/logo.png"
          alt="WebEarn Logo"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="object-contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={`${textSizes[size]} font-heading font-bold ${textColor}`}>
          WebEarn
        </span>
      )}
    </Link>
  );
}

