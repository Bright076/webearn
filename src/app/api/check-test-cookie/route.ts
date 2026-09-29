import { NextRequest, NextResponse } from "next/server";

// Check if the test cookie was received
export async function GET(request: NextRequest) {
  const testCookie = request.cookies.get("test_cookie");
  const allCookies = request.cookies.getAll();
  
  return NextResponse.json({
    hasTestCookie: !!testCookie,
    testCookieValue: testCookie?.value || null,
    allCookiesCount: allCookies.length,
    allCookies: allCookies.map(c => ({ name: c.name, value: c.value })),
  });
}
