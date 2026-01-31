// app/[locale]/HomeClient.tsx
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Download, Link as LinkIcon, Loader2, PlayCircle } from "lucide-react";
import { getPlatform } from "../../src/lib/detector";

type Props = { locale: string };

export default function HomeClient({ locale }: Props) {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const strings = useMemo(() => {
    const s = {
      es: {
        placeholder:
          "Pega el enlace de YouTube, Facebook, TikTok o Instagram aquí…",
        button: "Obtener",
        buttonLoading: "Procesando…",
        platformTag: "Plataforma",
        cardReady: "Listo para descargar desde",
        download: "Guardar video",
        hint: "Descarga solo contenido propio o con permiso.",
        invalid: "Ingresa una URL válida de una plataforma soportada.",
        failed: "Ocurrió un error al procesar el enlace.",
        label: "Enlace del video",
      },
      en: {
        placeholder:
          "Paste a YouTube, Facebook, TikTok or Instagram link here…",
        button: "Fetch",
        buttonLoading: "Processing…",
        platformTag: "Platform",
        cardReady: "Ready to download from",
        download: "Save video",
        hint: "Only download your own or authorized content.",
        invalid: "Please enter a valid URL from a supported platform.",
        failed: "Something went wrong while processing the link.",
        label: "Video link",
      },
      pt: {
        placeholder:
          "Cole o link do YouTube, Facebook, TikTok ou Instagram aqui…",
        button: "Obter",
        buttonLoading: "Processando…",
        platformTag: "Plataforma",
        cardReady: "Pronto para baixar de",
        download: "Salvar vídeo",
        hint: "Baixe apenas conteúdo próprio ou autorizado.",
        invalid: "Insira uma URL válida de uma plataforma suportada.",
        failed: "Ocorreu um erro ao processar o link.",
        label: "Link do vídeo",
      },
      fr: {
        placeholder:
          "Collez un lien YouTube, Facebook, TikTok ou Instagram ici…",
        button: "Obtenir",
        buttonLoading: "Traitement…",
        platformTag: "Plateforme",
        cardReady: "Prêt à télécharger depuis",
        download: "Enregistrer la vidéo",
        hint: "Téléchargez uniquement du contenu autorisé.",
        invalid:
          "Veuillez saisir une URL valide d’une plateforme prise en charge.",
        failed: "Une erreur est survenue lors du traitement du lien.",
        label: "Lien de la vidéo",
      },
      de: {
        placeholder:
          "Füge hier einen YouTube-, Facebook-, TikTok- oder Instagram-Link ein…",
        button: "Abrufen",
        buttonLoading: "Wird verarbeitet…",
        platformTag: "Plattform",
        cardReady: "Bereit zum Download von",
        download: "Video speichern",
        hint: "Lade nur eigene oder autorisierte Inhalte herunter.",
        invalid: "Bitte eine gültige URL einer unterstützten Plattform eingeben.",
        failed: "Beim Verarbeiten des Links ist ein Fehler aufgetreten.",
        label: "Video-Link",
      },
    } as const;

    return s[(s as any)[locale] ? (locale as keyof typeof s) : "en"];
  }, [locale]);

  const handleInputChange = (val: string) => {
    setUrl(val);
    const p = getPlatform(val);
    setPlatform(p);
    setErrorMsg(null);
    if (videoData) setVideoData(null);
  };

  const handleProcess = async () => {
    const p = getPlatform(url);
    if (!url || p === "Desconocido") {
      setErrorMsg(strings.invalid);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data?.error) {
        setErrorMsg(String(data.error));
        setVideoData(null);
      } else {
        setVideoData(data);
      }
    } catch (err) {
      console.error("Error", err);
      setErrorMsg(strings.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="video-url"
                className="text-sm font-medium text-slate-200"
              >
                {strings.label}
              </label>
              <p className="text-xs text-slate-400">{strings.hint}</p>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <LinkIcon size={18} />
              </div>

              <input
                id="video-url"
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                placeholder={strings.placeholder}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 py-4 pl-11 pr-36 text-base text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-700 focus:bg-slate-950/60"
                value={url}
                onChange={(e) => handleInputChange(e.target.value)}
                aria-invalid={!!errorMsg}
                aria-describedby={errorMsg ? "url-error" : undefined}
              />

              <button
                onClick={handleProcess}
                disabled={loading || !url}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex min-w-[132px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-800"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    {strings.buttonLoading}
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    {strings.button}
                  </>
                )}
              </button>
            </div>

            {errorMsg && (
              <p
                id="url-error"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {errorMsg}
              </p>
            )}

            {platform !== "Desconocido" && url && !errorMsg && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200">
                {strings.platformTag}:{" "}
                <span className="text-blue-100">{platform}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {videoData && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-44 w-full sm:h-auto sm:w-56 bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/proxy-image?url=${encodeURIComponent(
                  videoData.thumbnail
                )}`}
                alt={
                  videoData.title
                    ? `Thumbnail: ${videoData.title}`
                    : "Video thumbnail"
                }
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <PlayCircle className="text-white/85" size={44} />
              </div>
            </div>

            <div className="flex-1 p-5">
              <h3 className="text-base sm:text-lg font-semibold text-slate-100 line-clamp-2">
                {videoData.title}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {strings.cardReady}{" "}
                <span className="text-slate-200">{platform}</span>
              </p>

              <button
                onClick={() => {
                  const streamUrl = `/api/stream?url=${encodeURIComponent(
                    url
                  )}&title=${encodeURIComponent(videoData.title || "video")}`;
                  window.open(streamUrl, "_blank", "noopener,noreferrer");
                }}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-500"
              >
                <Download size={18} />
                {strings.download}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
