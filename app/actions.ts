"use server";

import { cookies } from "next/headers";

const AUTH_EXPIRY_TIME = 800 * 1000; // 800 seconds in milliseconds

export async function authenticate(password: string) {
  const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || "pass";

  if (password === correctPassword) {
    const cookieStore = await cookies();
    const now = Date.now();
    cookieStore.set("auth", "true", {
      expires: new Date(now + AUTH_EXPIRY_TIME),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return true;
  }
  return false;
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("auth");
  return !!auth;
}
