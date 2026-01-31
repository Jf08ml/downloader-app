// app/api/stream/route.ts
import { streamVideo } from "../../../src/lib/ytdlp";
import { validateVideoUrl } from "../../../src/lib/validate";
import { getClientIp, rateLimit } from "../../../src/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeFilename(title: string) {
  return (
    title
      .replace(/[^\w\s\-().]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120) || "video"
  );
}

export async function GET(request: Request) {
  const ip = getClientIp(request);

  const rl = rateLimit({
    key: `stream:${ip}`,
    limit: 6,
    windowMs: 60_000,
  });

  if (!rl.ok) {
    return new Response(
      JSON.stringify({ error: "Demasiadas descargas. Intenta de nuevo en unos segundos." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Limit": "6",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url") || "";
  const title = searchParams.get("title") || "video";

  const v = validateVideoUrl(rawUrl);
  if (!v.ok) {
    return new Response(JSON.stringify({ error: v.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { stream, kill } = streamVideo(v.url);
    const filename = `${safeFilename(title)}.mp4`;

    // mata proceso si el cliente aborta
    request.signal.addEventListener("abort", () => {
      try {
        kill();
      } catch {}
    });

    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
        stream.on("end", () => controller.close());
        stream.on("error", (err: Error) => {
          console.error("[/api/stream] Stream error:", err.message);
          controller.error(err);
        });
      },
      cancel() {
        try {
          kill();
        } catch {}
      },
    });

    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
          filename
        )}`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-RateLimit-Limit": "6",
        "X-RateLimit-Remaining": String(rl.remaining),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[/api/stream] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
