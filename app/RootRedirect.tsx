// app/RootRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SUPPORTED = ["es", "en", "pt", "fr", "de"] as const;

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let target = "es";

    try {
      const saved = localStorage.getItem("preferred_locale");
      if (saved && (SUPPORTED as readonly string[]).includes(saved)) {
        target = saved;
      }
    } catch {}

    router.replace(`/${target}`);
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 text-white grid place-items-center">
      <p className="text-sm text-slate-400">Redirecting…</p>
    </main>
  );
}
