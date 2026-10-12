import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const content = request.nextUrl.searchParams.get("utm_content")?.toLowerCase() ?? "";
  if (content.startsWith("b")) {
    const url = request.nextUrl.clone();
    url.pathname = "/b";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
