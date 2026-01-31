// src/lib/detector.ts (opcional, más robusto)
export const getPlatform = (url: string) => {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    if (host === "youtu.be" || host.endsWith("youtube.com")) return "YouTube";
    if (host.endsWith("instagram.com")) return "Instagram";
    if (host.endsWith("tiktok.com") || host === "vm.tiktok.com") return "TikTok";
    if (host.endsWith("facebook.com") || host === "fb.watch" || host.endsWith("fb.com")) return "Facebook";
    return "Desconocido";
  } catch {
    return "Desconocido";
  }
};
