import { ACCESS_TOKEN_COOKIE } from "@front/helpers/auth-cookie";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

async function forwardRequest(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, "");
  const targetUrl = `${API_URL}${path}${req.nextUrl.search}`;

  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.text();

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");

  if (body && !headers.has("content-type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Impossible de joindre l'API. Vérifiez que le backend tourne et que NEXT_PUBLIC_API_URL est correct.",
        details: error?.message,
      },
      { status: 502 },
    );
  }

  const data = await backendResponse.json().catch(() => null);

  const response = NextResponse.json(data ?? {}, {
    status: backendResponse.status,
  });

  if (backendResponse.ok && data?.data?.token) {
    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: data.data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_WEEK_SECONDS,
      path: "/",
    });
  } else if (backendResponse.status === 401) {
    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }

  return response;
}

export async function GET(req: NextRequest) {
  return forwardRequest(req);
}

export async function POST(req: NextRequest) {
  return forwardRequest(req);
}

export async function PUT(req: NextRequest) {
  return forwardRequest(req);
}

export async function PATCH(req: NextRequest) {
  return forwardRequest(req);
}

export async function DELETE(req: NextRequest) {
  return forwardRequest(req);
}
