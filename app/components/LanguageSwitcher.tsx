// app/components/LanguageSwitcher.tsx
"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LOCALES = ["es", "en", "pt", "fr", "de"] as const;
type Locale = (typeof LOCALES)[number];

const LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
};

function getCurrentLocale(pathname: string): Locale {
  const seg = pathname.split("/")[1] as string | undefined;
  return (LOCALES as readonly string[]).includes(seg ?? "") ? (seg as Locale) : "en";
}

// Cambia solo el primer segmento (/es/..., /en/...)
function withLocale(pathname: string, nextLocale: Locale): string {
  const parts = pathname.split("/");
  // parts[0] = "" (por el slash inicial)
  if (parts.length >= 2 && (LOCALES as readonly string[]).includes(parts[1])) {
    parts[1] = nextLocale;
    return parts.join("/") || `/${nextLocale}`;
  }
  // Si por alguna razón no hay locale en ruta, lo insertamos
  return `/${nextLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  const current = useMemo(() => getCurrentLocale(pathname), [pathname]);

  const query = searchParams?.toString();
  const currentLabel = LABELS[current];

  return (
    <div className={className}>
      <label className="sr-only" htmlFor="lang-switcher">
        Language
      </label>

      <div className="relative inline-flex items-center">
        <select
          id="lang-switcher"
          value={current}
          onChange={(e) => {
            const nextLocale = e.target.value as Locale;

            // Construye nueva URL conservando querystring
            const nextPath = withLocale(pathname, nextLocale);
            const href = query ? `${nextPath}?${query}` : nextPath;

            // (Opcional) recordar idioma
            try {
              localStorage.setItem("preferred_locale", nextLocale);
            } catch {}

            router.push(href);
          }}
          className="appearance-none rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 pr-10 text-sm text-slate-100 outline-none hover:border-slate-700 focus:border-slate-600"
          aria-label={`Current language: ${currentLabel}`}
        >
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {LABELS[l]}
            </option>
          ))}
        </select>

        {/* caret */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 h-4 w-4 text-slate-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
