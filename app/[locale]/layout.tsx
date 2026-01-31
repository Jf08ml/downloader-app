// app/[locale]/layout.tsx
import type { Metadata } from "next";

const SUPPORTED = ["es", "en", "pt", "fr", "de"] as const;
type Locale = (typeof SUPPORTED)[number];

function normalizeLocale(locale: string): Locale {
  return (SUPPORTED as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en";
}

function getCopy(locale: Locale) {
  const dict = {
    es: {
      brand: "Social Downloader",
      title: "Descargar videos de YouTube, TikTok, Instagram y Facebook",
      description:
        "Obtén información y descarga videos desde enlaces públicos (solo contenido autorizado). Rápido, simple y compatible con varios idiomas.",
    },
    en: {
      brand: "Social Downloader",
      title: "Download videos from YouTube, TikTok, Instagram & Facebook",
      description:
        "Fetch info and download videos from public links (authorized content only). Fast, simple, and SEO-ready for multiple languages.",
    },
    pt: {
      brand: "Social Downloader",
      title: "Baixar vídeos do YouTube, TikTok, Instagram e Facebook",
      description:
        "Obtenha informações e baixe vídeos de links públicos (somente conteúdo autorizado). Rápido e pronto para SEO em vários idiomas.",
    },
    fr: {
      brand: "Social Downloader",
      title:
        "Télécharger des vidéos depuis YouTube, TikTok, Instagram et Facebook",
      description:
        "Récupérez les infos et téléchargez des vidéos depuis des liens publics (contenu autorisé uniquement). Rapide et optimisé SEO multi-langues.",
    },
    de: {
      brand: "Social Downloader",
      title: "Videos von YouTube, TikTok, Instagram & Facebook herunterladen",
      description:
        "Infos abrufen und Videos von öffentlichen Links herunterladen (nur autorisierte Inhalte). Schnell, einfach und SEO-ready für mehrere Sprachen.",
    },
  } as const;

  return dict[locale];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const copy = getCopy(locale);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const canonical = `${siteUrl}/${locale}`;

  // ✅ hreflang mapping
  const languages: Record<string, string> = {};
  for (const l of SUPPORTED) languages[l] = `${siteUrl}/${l}`;

  const fullTitle = `${copy.brand} — ${copy.title}`;

  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description: copy.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: fullTitle,
      description: copy.description,
      siteName: copy.brand,
      locale,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: copy.brand,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: copy.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
