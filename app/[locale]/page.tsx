// app/[locale]/page.tsx
import HomeClient from "./HomeClient";
import LanguageSwitcher from "../components/LanguageSwitcher";

const SUPPORTED = ["es", "en", "pt", "fr", "de"] as const;
type Locale = (typeof SUPPORTED)[number];

function normalizeLocale(locale: string): Locale {
  return (SUPPORTED as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en";
}

function t(locale: Locale) {
  const dict = {
    es: {
      brand: "Social Downloader",
      description:
        "Descarga videos desde enlaces en segundos. Rápido, simple y compatible con varias plataformas.",
      h1: "Descarga videos en segundos",
      subtitle:
        "Pega el enlace, revisa la información y guarda el video. Fácil y sin complicaciones.",
      featuresTitle: "¿Qué puedes hacer?",
      featureList: [
        "Detecta la plataforma automáticamente",
        "Previsualiza título y miniatura antes de descargar",
        "Descarga rápida desde un solo enlace",
        "Diseño optimizado para móvil y escritorio",
      ],
      faqTitle: "Preguntas frecuentes",
      faq: [
        {
          q: "¿Qué plataformas son compatibles?",
          a: "YouTube, Facebook, TikTok e Instagram. La compatibilidad puede variar según el enlace.",
        },
        {
          q: "¿Necesito crear una cuenta?",
          a: "No. Solo pega el enlace y continúa.",
        },
        {
          q: "¿Es seguro usar mi enlace aquí?",
          a: "Procesamos tu enlace únicamente para obtener la información del video y generar la descarga. No publicamos tu contenido.",
        },
        {
          q: "¿Puedo descargar cualquier video?",
          a: "Descarga únicamente contenido propio o con autorización. Respeta los derechos de autor y los términos de cada plataforma.",
        },
      ],
      legalNote:
        "Usa esta herramienta solo para contenido propio o con autorización. Respeta derechos de autor y los términos de las plataformas.",
    },

    en: {
      brand: "Social Downloader",
      description:
        "Download videos from links in seconds. Fast, simple, and compatible with multiple platforms.",
      h1: "Download videos in seconds",
      subtitle:
        "Paste a link, review the details, and save the video. Simple and hassle-free.",
      featuresTitle: "What you can do",
      featureList: [
        "Auto-detect the platform",
        "Preview title and thumbnail before downloading",
        "Fast downloads from a single link",
        "Optimized for mobile and desktop",
      ],
      faqTitle: "FAQ",
      faq: [
        {
          q: "Which platforms are supported?",
          a: "YouTube, Facebook, TikTok, and Instagram. Support may vary depending on the link.",
        },
        {
          q: "Do I need an account?",
          a: "No. Just paste the link and continue.",
        },
        {
          q: "Is it safe to use my link here?",
          a: "We use your link only to fetch video info and generate a download. We don’t publish your content.",
        },
        {
          q: "Can I download any video?",
          a: "Only download content you own or have permission to use. Respect copyright and platform terms.",
        },
      ],
      legalNote:
        "Use this tool only for content you own or are authorized to download. Respect copyright and platform terms.",
    },

    pt: {
      brand: "Social Downloader",
      description:
        "Baixe vídeos a partir de links em segundos. Rápido, simples e compatível com várias plataformas.",
      h1: "Baixe vídeos em segundos",
      subtitle:
        "Cole o link, confira as informações e salve o vídeo. Simples e sem complicação.",
      featuresTitle: "O que você pode fazer",
      featureList: [
        "Detecta a plataforma automaticamente",
        "Prévia de título e miniatura antes de baixar",
        "Download rápido com um único link",
        "Otimizado para celular e computador",
      ],
      faqTitle: "Perguntas frequentes",
      faq: [
        {
          q: "Quais plataformas são compatíveis?",
          a: "YouTube, Facebook, TikTok e Instagram. A compatibilidade pode variar conforme o link.",
        },
        {
          q: "Preciso criar uma conta?",
          a: "Não. Basta colar o link e continuar.",
        },
        {
          q: "É seguro usar meu link aqui?",
          a: "Usamos o link apenas para obter as informações do vídeo e gerar o download. Não publicamos seu conteúdo.",
        },
        {
          q: "Posso baixar qualquer vídeo?",
          a: "Baixe apenas conteúdo próprio ou autorizado. Respeite direitos autorais e os termos das plataformas.",
        },
      ],
      legalNote:
        "Use esta ferramenta apenas para conteúdo próprio ou com autorização. Respeite direitos autorais e os termos das plataformas.",
    },

    fr: {
      brand: "Social Downloader",
      description:
        "Téléchargez des vidéos depuis des liens en quelques secondes. Rapide, simple et compatible avec plusieurs plateformes.",
      h1: "Téléchargez des vidéos en quelques secondes",
      subtitle:
        "Collez un lien, vérifiez les infos, puis enregistrez la vidéo. Simple et sans effort.",
      featuresTitle: "Ce que vous pouvez faire",
      featureList: [
        "Détection automatique de la plateforme",
        "Aperçu du titre et de la miniature avant téléchargement",
        "Téléchargement rapide à partir d’un seul lien",
        "Optimisé pour mobile et ordinateur",
      ],
      faqTitle: "FAQ",
      faq: [
        {
          q: "Quelles plateformes sont compatibles ?",
          a: "YouTube, Facebook, TikTok et Instagram. La compatibilité peut varier selon le lien.",
        },
        {
          q: "Dois-je créer un compte ?",
          a: "Non. Collez simplement le lien et continuez.",
        },
        {
          q: "Est-ce sûr d’utiliser mon lien ici ?",
          a: "Nous utilisons votre lien uniquement pour récupérer les infos et générer le téléchargement. Nous ne publions pas votre contenu.",
        },
        {
          q: "Puis-je télécharger n’importe quelle vidéo ?",
          a: "Téléchargez uniquement du contenu que vous possédez ou pour lequel vous avez l’autorisation. Respectez le droit d’auteur et les conditions.",
        },
      ],
      legalNote:
        "Utilisez cet outil uniquement pour du contenu autorisé. Respectez le droit d’auteur et les conditions des plateformes.",
    },

    de: {
      brand: "Social Downloader",
      description:
        "Lade Videos in Sekunden über einen Link herunter. Schnell, einfach und mit mehreren Plattformen kompatibel.",
      h1: "Videos in Sekunden herunterladen",
      subtitle:
        "Link einfügen, Infos prüfen und das Video speichern. Einfach und unkompliziert.",
      featuresTitle: "Was du tun kannst",
      featureList: [
        "Plattform automatisch erkennen",
        "Titel und Thumbnail vor dem Download ansehen",
        "Schneller Download über einen einzigen Link",
        "Optimiert für Mobile und Desktop",
      ],
      faqTitle: "FAQ",
      faq: [
        {
          q: "Welche Plattformen werden unterstützt?",
          a: "YouTube, Facebook, TikTok und Instagram. Die Unterstützung kann je nach Link variieren.",
        },
        {
          q: "Brauche ich ein Konto?",
          a: "Nein. Einfach Link einfügen und fortfahren.",
        },
        {
          q: "Ist es sicher, meinen Link hier zu verwenden?",
          a: "Wir verwenden den Link nur, um Videoinfos abzurufen und den Download zu erzeugen. Wir veröffentlichen keine Inhalte.",
        },
        {
          q: "Kann ich jedes Video herunterladen?",
          a: "Lade nur Inhalte herunter, die dir gehören oder für die du eine Erlaubnis hast. Urheberrecht & Plattformregeln beachten.",
        },
      ],
      legalNote:
        "Nutze das Tool nur für eigene oder autorisierte Inhalte. Urheberrecht und Plattformbedingungen beachten.",
    },
  } as const;

  return dict[locale];
}


export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);
  const copy = t(locale);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const canonical = `${siteUrl}/${locale}`;

  // JSON-LD: WebApplication
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: copy.brand,
    url: canonical,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description: copy.description,
  };

  // JSON-LD: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="min-h-screen text-white bg-slate-950">
      {/* Selector arriba derecha */}
      <div className="absolute right-1 top-1">
        <LanguageSwitcher />
      </div>
      {/* Fondo decorativo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(1000px 500px at 15% 0%, rgba(59,130,246,0.22), transparent 55%), radial-gradient(900px 500px at 85% 0%, rgba(168,85,247,0.20), transparent 55%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-14">
        {/* H1 + contenido indexable */}
        <header className="text-center space-y-4 relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/40 px-4 py-2 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {copy.brand}
          </p>

          <h1 className="text-balance text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
            {copy.h1}
          </h1>

          <p className="mx-auto max-w-2xl text-pretty text-slate-300">
            {copy.subtitle}
          </p>
        </header>

        {/* UI interactiva */}
        <section aria-label="Downloader" className="mt-10">
          <HomeClient locale={locale} />
        </section>

        {/* Features */}
        <section className="mt-14" aria-label={copy.featuresTitle}>
          <h2 className="text-xl font-semibold">{copy.featuresTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {copy.featureList.map((f) => (
              <li
                key={f}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-slate-200"
              >
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-14" aria-label={copy.faqTitle}>
          <h2 className="text-xl font-semibold">{copy.faqTitle}</h2>
          <div className="mt-4 space-y-3">
            {copy.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-800 bg-slate-900/40 p-4"
              >
                <summary className="cursor-pointer list-none font-medium text-slate-100">
                  {item.q}
                  <span className="float-right text-slate-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-16 text-center text-xs text-slate-500">
          <p>{copy.legalNote}</p>
        </footer>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
