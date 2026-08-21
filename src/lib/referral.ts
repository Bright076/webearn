/**
 * WebEarn Referral Attribution System
 * 
 * COOKIE STRUCTURE:
 * - Name: webearn_ref
 * - Attributes: httpOnly, secure, sameSite=lax
 * - Expiry: 30 days from first capture
 * - Payload: { affiliate_id: UUID, product_id: UUID, captured_at: ISO timestamp }
 * 
 * FIRST-TOUCH ATTRIBUTION RULES:
 * 1. Cookie is set on first referral link click via /api/referral endpoint
 * 2. Once set, cookie MUST NOT be overwritten by subsequent different referral links
 * 3. Only set a new cookie if none exists OR existing one has expired
 * 4. Cookie is httpOnly - NEVER accessible via client-side JavaScript
 * 5. Form submissions read cookie server-side only - client cannot manipulate
 * 6. Attribution persists for 30 days or until successful form submission
 * 
 * SECURITY:
 * - Cookie payload is signed/encoded to prevent tampering
 * - IP addresses are hashed before storage (privacy)
 * - Client-submitted affiliate data is IGNORED - only server cookie is trusted
 * - httpOnly prevents XSS attacks from stealing/modifying attribution
 */

import crypto from "crypto";

const COOKIE_NAME = "webearn_ref";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const SECRET_KEY = process.env.REFERRAL_COOKIE_SECRET || "your-secret-key-change-this";

export interface ReferralData {
  affiliate_id: string;
  product_id: string;
  captured_at: string;
}

/**
 * Encode and sign referral data for cookie storage
 */
export function encodeReferralData(data: ReferralData): string {
  const payload = JSON.stringify(data);
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
  
  return Buffer.from(`${payload}.${signature}`).toString("base64");
}

/**
 * Decode and verify referral data from cookie
 * Returns null if invalid or tampered
 */
export function decodeReferralData(encoded: string): ReferralData | null {
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const [payload, signature] = decoded.split(".");
    
    if (!payload || !signature) {
      return null;
    }
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(payload)
      .digest("hex");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const data = JSON.parse(payload) as ReferralData;
    
    // Verify data structure
    if (!data.affiliate_id || !data.product_id || !data.captured_at) {
      return null;
    }
    
    // Check if expired (30 days)
    const capturedAt = new Date(data.captured_at);
    const expiresAt = new Date(capturedAt.getTime() + COOKIE_MAX_AGE * 1000);
    
    if (new Date() > expiresAt) {
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * Hash IP address for privacy-compliant storage
 */
export function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + SECRET_KEY)
    .digest("hex");
}

/**
 * Generate cookie options for referral cookie
 */
export function getReferralCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  };
}

export { COOKIE_NAME, COOKIE_MAX_AGE };
