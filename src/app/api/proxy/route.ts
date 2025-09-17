import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return new Response("Missing url", { status: 400 });
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Podverse/2.0/Web"
    }
  });

  if (!response.ok) {
    return new Response("Image fetch failed", { status: response.status });
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = await response.arrayBuffer();

  return new Response(Buffer.from(buffer), {
    headers: { "Content-Type": contentType }
  });
}