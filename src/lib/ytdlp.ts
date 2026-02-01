import { spawn, execFile } from "child_process";
import type { Readable } from "stream";

const YT_DLP_BIN = process.env.YT_DLP_PATH || "yt-dlp";
const YT_DLP_COOKIES = process.env.YT_DLP_COOKIES;

const STREAM_FORMAT = process.env.YT_DLP_STREAM_FORMAT || "b[ext=mp4]/b";

const YT_DLP_REMOTE_COMPONENTS = process.env.YT_DLP_REMOTE_COMPONENTS || "ejs:github";

function authAndEjsArgs(): string[] {
  const args: string[] = [];
  if (YT_DLP_COOKIES) args.push("--cookies", YT_DLP_COOKIES);
  // Habilita EJS solver (necesario para YouTube en muchos casos)
  if (YT_DLP_REMOTE_COMPONENTS) args.push("--remote-components", YT_DLP_REMOTE_COMPONENTS);
  return args;
}


export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number | null;
  ext: string;
}

/**
 * Obtiene metadatos del video usando yt-dlp --dump-json.
 */
export function getVideoInfo(url: string): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    execFile(
      YT_DLP_BIN,
      [
        ...authAndEjsArgs(),
        "--dump-json",
        "--no-warnings",
        "--no-playlist",
        "-f",
        "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/bv*+ba/b",
        url,
      ],
      { timeout: 30_000, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          const msg = stderr?.toString() || error.message;
          if (msg.includes("is not recognized") || msg.includes("ENOENT")) {
            reject(new Error("yt-dlp no está instalado o no se encuentra en el PATH."));
          } else if (msg.includes("Private video") || msg.includes("Video unavailable")) {
            reject(new Error("El video es privado o no está disponible."));
          } else {
            reject(new Error(`yt-dlp error: ${msg}`));
          }
          return;
        }

        try {
          const json = JSON.parse(stdout.toString());
          resolve({
            title: json.title || json.fulltitle || "Video",
            thumbnail:
              json.thumbnail ||
              json.thumbnails?.[json.thumbnails.length - 1]?.url ||
              "",
            duration: json.duration ?? null,
            ext: json.ext || "mp4",
          });
        } catch {
          reject(new Error("No se pudo analizar la respuesta de yt-dlp."));
        }
      }
    );
  });
}

/**
 * Inicia yt-dlp para transmitir el video por stdout.
 * Retorna el stream de Node.js y una funcion kill para abortar.
 */
export function streamVideo(url: string): {
  stream: Readable;
  kill: () => void;
} {
  const args = [
    ...authAndEjsArgs(),
    "-f",
    STREAM_FORMAT,
    "--no-warnings",
    "--no-playlist",
    "--no-progress",
    "--no-part",
    "--no-mtime",
    "--merge-output-format",
    "mp4",
    "-o",
    "-",
    url,
  ];

  const child = spawn(YT_DLP_BIN, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stderr?.on("data", (chunk: Buffer) => {
    console.error("[yt-dlp stderr]", chunk.toString());
  });

  const kill = () => {
    try {
      child.kill("SIGTERM");
      setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {}
      }, 1500);
    } catch {}
  };

  return {
    stream: child.stdout as Readable,
    kill,
  };
}
