import { NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 *
 * Clears the httpOnly `accessToken` and `refreshToken` cookies that the
 * backend sets on login. Because those cookies are httpOnly the browser's
 * JavaScript cannot touch them directly — only a server response with
 * Set-Cookie can remove them. This route does exactly that.
 *
 * We also try to forward the request to the real backend so it can
 * invalidate the refresh token server-side, but we swallow any error so
 * a backend outage never blocks the client-side logout.
 */
export async function POST() {
  // Try to inform the backend (best-effort).
  try {
    const apiOrigin = process.env.A6_API_ORIGIN ?? "http://localhost:4000";
    await fetch(`${apiOrigin}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Backend unreachable — proceed with cookie clearing anyway.
  }

  const response = NextResponse.json({ success: true });

  // Clear both cookies by setting Max-Age=0 (works for httpOnly cookies too
  // because this is a server response, not client-side JS).
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0, // Instantly expired → browser deletes it.
  };

  response.cookies.set("accessToken", "", cookieOptions);
  response.cookies.set("refreshToken", "", cookieOptions);

  return response;
}
