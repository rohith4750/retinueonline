import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://hoteltheretinue.in/api/public";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, await params);
}

async function proxy(
  request: NextRequest,
  { path }: { path: string[] }
) {
  const pathStr = path.join("/");
  const url = new URL(request.url);
  const search = url.searchParams.toString();
  const target = `${API_BASE}/${pathStr}${search ? `?${search}` : ""}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (
      key.toLowerCase() === "host" ||
      key.toLowerCase() === "connection" ||
      key.toLowerCase().startsWith("sec-") ||
      key.toLowerCase().startsWith("next-")
    )
      return;
    headers.set(key, value);
  });
  if (!headers.has("content-type")) headers.set("Content-Type", "application/json");

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = await request.text();
    } catch {
      body = undefined;
    }
  }

  try {
    const res = await fetch(target, {
      method: request.method,
      headers,
      body: body || undefined,
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    console.error("[proxy]", err);
    return NextResponse.json(
      {
        success: false,
        error: "PROXY_ERROR",
        message: "Unable to reach the server. Try again.",
      },
      { status: 502 }
    );
  }
}
