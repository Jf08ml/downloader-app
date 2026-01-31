// src/lib/validate.ts
const ALLOWED_HOSTS = new Set([
  // YouTube
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",

  // Instagram
  "instagram.com",
  "www.instagram.com",

  // TikTok
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
  "m.tiktok.com",

  // Facebook
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
  "fb.watch",
  "fb.com",
  "www.fb.com",
]);

const PRIVATE_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
]);

export type Platform = "YouTube" | "Instagram" | "TikTok" | "Facebook" | "Desconocido";

export function getPlatformFromUrl(urlStr: string): Platform {
  let u: URL;
  try {
    u = new URL(urlStr);
  } catch {
    return "Desconocido";
  }

  const host = u.hostname.toLowerCase();

  if (host === "youtu.be" || host.endsWith("youtube.com")) return "YouTube";
  if (host.endsWith("instagram.com")) return "Instagram";
  if (host.endsWith("tiktok.com") || host === "vm.tiktok.com") return "TikTok";
  if (host.endsWith("facebook.com") || host === "fb.watch" || host.endsWith("fb.com"))
    return "Facebook";

  return "Desconocido";
}

export function validateVideoUrl(urlStr: string): { ok: true; url: string; platform: Platform } | { ok: false; error: string } {
  const trimmed = (urlStr || "").trim();
  if (!trimmed) return { ok: false, error: "URL vacía" };
  if (trimmed.length > 2000) return { ok: false, error: "URL demasiado larga" };

  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    return { ok: false, error: "URL inválida" };
  }

  const protocol = u.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    return { ok: false, error: "Solo se permiten URLs http/https" };
  }

  const host = u.hostname.toLowerCase();

  // Anti-SSRF básico (host privados)
  if (PRIVATE_HOSTS.has(host)) {
    return { ok: false, error: "Host no permitido" };
  }

  // Bloquea IPs directas (simple)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return { ok: false, error: "Host no permitido" };
  }

  // Solo dominios permitidos
  if (!ALLOWED_HOSTS.has(host) && !Array.from(ALLOWED_HOSTS).some((h) => host.endsWith(`.${h}`))) {
    // Nota: allow subdomains de dominios en lista, ej. something.youtube.com
    // Si quieres estricto, puedes quitar este endsWith.
    return { ok: false, error: "Plataforma no soportada" };
  }

  const platform = getPlatformFromUrl(trimmed);
  if (platform === "Desconocido") {
    return { ok: false, error: "Plataforma no soportada" };
  }

  return { ok: true, url: u.toString(), platform };
}

export function validateImageUrl(urlStr: string): { ok: true; url: string } | { ok: false; error: string } {
  const trimmed = (urlStr || "").trim();
  if (!trimmed) return { ok: false, error: "URL requerida" };
  if (trimmed.length > 2000) return { ok: false, error: "URL demasiado larga" };

  let u: URL;
  try {
    u = new URL(trimmed);
  } catch {
    return { ok: false, error: "URL inválida" };
  }

  // Solo https recomendado para imágenes
  if (u.protocol !== "https:" && u.protocol !== "http:") {
    return { ok: false, error: "URL inválida" };
  }

  const host = u.hostname.toLowerCase();

  // Evita que usen tu endpoint como proxy general (SSRF)
  if (PRIVATE_HOSTS.has(host) || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return { ok: false, error: "Host no permitido" };
  }

  // Permite solo hosts “típicos” de thumbnails (puedes ampliar)
  const allowedImageHosts = [
    "i.ytimg.com",
    "ytimg.com",
    "scontent",
    "fbcdn.net",
    "cdninstagram.com",
    "tiktokcdn.com",
    "tiktokv.com",
  ];

  const okHost =
    allowedImageHosts.some((h) => host === h || host.endsWith(`.${h}`)) ||
    host.endsWith("googleusercontent.com"); // thumbnails a veces

  if (!okHost) {
    return { ok: false, error: "Origen de imagen no permitido" };
  }

  return { ok: true, url: u.toString() };
}
