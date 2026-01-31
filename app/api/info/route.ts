// app/api/info/route.ts
import { NextResponse } from "next/server";
import { getVideoInfo } from "../../../src/lib/ytdlp";
import { validateVideoUrl } from "../../../src/lib/validate";
import { getClientIp, rateLimit } from "../../../src/lib/rateLimit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const ip = getClientIp(request);

  const rl = rateLimit({
    key: `info:${ip}`,
    limit: 15,
    windowMs: 60_000,
  });

  if (!rl.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Limit": "15",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";

  const v = validateVideoUrl(rawUrl);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }

  try {
    const info = await getVideoInfo(v.url);

    return NextResponse.json(
      {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        platform: v.platform,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=300",
          "X-RateLimit-Limit": "15",
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[/api/info] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
