import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/").pop();
  if (!slug) return NextResponse.next();

  try {
    const slugResponse = await fetch(`${req.nextUrl.origin}/api/urls/${slug}`);
    if (slugResponse.status === 404) {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    const data = await slugResponse.json();

    if (data?.url) {
      return NextResponse.redirect(data.url);
    }
  } catch (e) {
    console.log(e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
