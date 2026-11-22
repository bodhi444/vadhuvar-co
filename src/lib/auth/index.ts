import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AdminUser } from "@/types";

const COOKIE_NAME = "fm_admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "cinematic-frame-motion-studio-ultra-secure-secret-key-2025"
);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  exp?: number;
}

export async function createSession(user: AdminUser, remember: boolean = false): Promise<string> {
  const expiresIn = remember ? "30d" : "24h";
  const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return token;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as "admin" | "editor") || "admin",
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
