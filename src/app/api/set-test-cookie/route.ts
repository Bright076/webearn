import { NextResponse } from "next/server";

// Force Node.js runtime for proper cookie handling
export const runtime = 'nodejs';

// Simple test to see if cookies work at all
export async function GET() {
  const response = NextResponse.json({ message: "Cookie set!" });
  
  // Try to set a simple test cookie
  response.cookies.set("test_cookie", "hello_world", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
  
  console.log("Test cookie set with these options:");
  console.log("- httpOnly: true");
  console.log("- secure:", process.env.NODE_ENV === "production");
  console.log("- sameSite: lax");
  console.log("- path: /");
  
  return response;
}
