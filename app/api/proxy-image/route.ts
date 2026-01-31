// app/api/proxy-image/route.ts
import { validateImageUrl } from "../../../src/lib/validate";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("url") || "";

  const v = validateImageUrl(raw);
  if (!v.ok) {
    return new Response(v.error, { status: 400 });
  }

  try {
    const res = await fetch(v.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return new Response("No se pudo obtener la imagen", { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return new Response("Respuesta no es una imagen", { status: 502 });
    }

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("[/api/proxy-image] Error:", e);
    return new Response("Error al obtener la imagen", { status: 500 });
  }
}
