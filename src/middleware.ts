import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname }: { pathname: string } = request.nextUrl;
  const token = cookies().get("token");

  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  const userInfo = await fetch("http://localhost:8080/api/hungara/me-admin", {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
    cache: "no-store",
  });

  const monitorInfo = await fetch(
    "http://localhost:8080/api/hungara/me-monitor",
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      cache: "no-store",
    }
  );

  let account = await userInfo.json();

  // const account = await userInfo.json();

  if (token && !account?.user) {
    account = await monitorInfo.json();
  }

  // Check the role and redirect based on the role
  switch (account?.user?.role) {
    case "admin":
      if (
        !pathname.startsWith("/admin/establishments") &&
        !pathname.startsWith("/admin/establishments/create") &&
        !pathname.startsWith("/admin/monitors") &&
        !pathname.startsWith("/admin/monitors/create") &&
        !pathname.startsWith("/admin/playlists") &&
        !pathname.startsWith("/admin/playlists/create") &&
        !pathname.startsWith("/admin/playlists/bound-monitor-playlist") &&
        !pathname.startsWith("/admin/advertisements") &&
        !pathname.startsWith("/admin/advertisements/create")
      ) {
        return NextResponse.redirect(
          new URL("/admin/establishments", request.url)
        );
      }

      break;
    case "monitor":
      if (!request.nextUrl.pathname.startsWith("/monitor/advertisements")) {
        return NextResponse.redirect(
          new URL("/monitor/advertisements", request.url)
        );
      }
      break;

    default:
      return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    // Match all routes except the ones that start with /login and api and the static folder
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
