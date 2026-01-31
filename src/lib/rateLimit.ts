// src/lib/rateLimit.ts
type RateLimitResult =
  | { ok: true; remaining: number; resetMs: number }
  | { ok: false; remaining: 0; resetMs: number };

type Bucket = {
  count: number;
  resetAt: number; // epoch ms
};

const buckets = new Map<string, Bucket>();

/**
 * Rate limit in-memory (por instancia).
 * En serverless con múltiples instancias, cada instancia lleva su propio conteo.
 * Para producción con tráfico alto, lo ideal es Redis/KV.
 */
export function rateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();

  // Limpieza simple (evita crecer infinito)
  // Nota: no es perfecto, pero suficiente para bajo/medio tráfico
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetMs: resetAt - now };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetMs: existing.resetAt - now };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return {
    ok: true,
    remaining: Math.max(0, limit - existing.count),
    resetMs: existing.resetAt - now,
  };
}

/**
 * Intenta obtener IP del cliente desde headers típicos de proxy.
 * Si no hay, retorna "unknown".
 */
export function getClientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim() || "unknown";

  const xr = request.headers.get("x-real-ip");
  if (xr) return xr.trim() || "unknown";

  return "unknown";
}
