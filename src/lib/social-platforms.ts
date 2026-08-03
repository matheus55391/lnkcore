export type SocialPlatformId =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "facebook"
  | "linkedin"
  | "whatsapp"
  | "github"
  | "discord"
  | "pinterest"
  | "snapchat"
  | "telegram"
  | "threads"
  | "twitch"
  | "spotify"
  | "link";

export type SocialPlatform = {
  id: SocialPlatformId;
  label: string;
  match: (hostname: string, href: string) => boolean;
};

/** Platforms the user can pick when adding a social icon */
export type SelectableSocial = {
  id: Exclude<SocialPlatformId, "link">;
  label: string;
  /** Shown under the input */
  hint: string;
  placeholder: string;
  /** Build profile URL from username/handle (or full URL passthrough) */
  buildUrl: (input: string) => string;
};

function stripAt(value: string) {
  return value.trim().replace(/^@/, "");
}

function asUrlOrHandle(input: string, buildFromHandle: (handle: string) => string) {
  const value = input.trim();
  if (/^https?:\/\//i.test(value)) return value;
  return buildFromHandle(stripAt(value));
}

export const SELECTABLE_SOCIALS: SelectableSocial[] = [
  {
    id: "instagram",
    label: "Instagram",
    hint: "Usuário ou URL do perfil",
    placeholder: "seu usuario",
    buildUrl: (v) =>
      asUrlOrHandle(v, (h) => `https://instagram.com/${h}`),
  },
  {
    id: "tiktok",
    label: "TikTok",
    hint: "Usuário ou URL do perfil",
    placeholder: "seu usuario",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://tiktok.com/@${h}`),
  },
  {
    id: "youtube",
    label: "YouTube",
    hint: "Canal, @handle ou URL",
    placeholder: "@seucanal",
    buildUrl: (v) =>
      asUrlOrHandle(v, (h) =>
        h.startsWith("UC") || h.includes("/")
          ? `https://youtube.com/${h}`
          : `https://youtube.com/@${h}`
      ),
  },
  {
    id: "x",
    label: "X",
    hint: "Usuário ou URL do perfil",
    placeholder: "seu usuario",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://x.com/${h}`),
  },
  {
    id: "facebook",
    label: "Facebook",
    hint: "Usuário, página ou URL",
    placeholder: "suapagina",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://facebook.com/${h}`),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    hint: "Usuário ou URL do perfil",
    placeholder: "in/seu usuario",
    buildUrl: (v) =>
      asUrlOrHandle(v, (h) =>
        h.startsWith("in/") || h.startsWith("company/")
          ? `https://linkedin.com/${h}`
          : `https://linkedin.com/in/${h}`
      ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hint: "Número com DDI ou URL",
    placeholder: "5511999999999",
    buildUrl: (v) =>
      asUrlOrHandle(v, (h) => `https://wa.me/${h.replace(/\D/g, "")}`),
  },
  {
    id: "github",
    label: "GitHub",
    hint: "Usuário ou URL do perfil",
    placeholder: "seu usuario",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://github.com/${h}`),
  },
  {
    id: "discord",
    label: "Discord",
    hint: "Convite ou URL",
    placeholder: "codigo-do-convite",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://discord.gg/${h}`),
  },
  {
    id: "telegram",
    label: "Telegram",
    hint: "Usuário ou URL",
    placeholder: "seu usuario",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://t.me/${h}`),
  },
  {
    id: "threads",
    label: "Threads",
    hint: "Usuário ou URL",
    placeholder: "seu usuario",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://threads.net/@${h}`),
  },
  {
    id: "pinterest",
    label: "Pinterest",
    hint: "Usuário ou URL",
    placeholder: "seu usuario",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://pinterest.com/${h}`),
  },
  {
    id: "twitch",
    label: "Twitch",
    hint: "Canal ou URL",
    placeholder: "seucanal",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://twitch.tv/${h}`),
  },
  {
    id: "spotify",
    label: "Spotify",
    hint: "URL do artista, playlist ou perfil",
    placeholder: "https://open.spotify.com/...",
    buildUrl: (v) => asUrlOrHandle(v, (h) => `https://open.spotify.com/user/${h}`),
  },
  {
    id: "snapchat",
    label: "Snapchat",
    hint: "Usuário ou URL",
    placeholder: "seu usuario",
    buildUrl: (v) =>
      asUrlOrHandle(v, (h) => `https://snapchat.com/add/${h}`),
  },
];

const platforms: SocialPlatform[] = [
  {
    id: "instagram",
    label: "Instagram",
    match: (h) => h.includes("instagram.com"),
  },
  {
    id: "tiktok",
    label: "TikTok",
    match: (h) => h.includes("tiktok.com"),
  },
  {
    id: "youtube",
    label: "YouTube",
    match: (h) => h.includes("youtube.com") || h === "youtu.be",
  },
  {
    id: "x",
    label: "X",
    match: (h) => h === "x.com" || h.includes("twitter.com"),
  },
  {
    id: "facebook",
    label: "Facebook",
    match: (h) => h.includes("facebook.com") || h === "fb.com",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    match: (h) => h.includes("linkedin.com"),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    match: (h, href) =>
      h.includes("whatsapp.com") ||
      h === "wa.me" ||
      href.startsWith("https://api.whatsapp.com"),
  },
  {
    id: "github",
    label: "GitHub",
    match: (h) => h === "github.com",
  },
  {
    id: "discord",
    label: "Discord",
    match: (h) => h.includes("discord.com") || h.includes("discord.gg"),
  },
  {
    id: "pinterest",
    label: "Pinterest",
    match: (h) => h.includes("pinterest.com") || h === "pin.it",
  },
  {
    id: "snapchat",
    label: "Snapchat",
    match: (h) => h.includes("snapchat.com"),
  },
  {
    id: "telegram",
    label: "Telegram",
    match: (h) => h.includes("t.me") || h.includes("telegram.org"),
  },
  {
    id: "threads",
    label: "Threads",
    match: (h) => h.includes("threads.net"),
  },
  {
    id: "twitch",
    label: "Twitch",
    match: (h) => h.includes("twitch.tv"),
  },
  {
    id: "spotify",
    label: "Spotify",
    match: (h) => h.includes("spotify.com"),
  },
];

export function getSelectableSocial(id: string): SelectableSocial | undefined {
  return SELECTABLE_SOCIALS.find((p) => p.id === id);
}

export function detectSocialPlatform(url: string): SocialPlatform {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const href = url.toLowerCase();
    const found = platforms.find((p) => p.match(hostname, href));
    if (found) return found;
  } catch {
    // invalid URL — fall through
  }
  return { id: "link", label: "Link", match: () => false };
}

export function platformLabelFromUrl(url: string): string {
  return detectSocialPlatform(url).label;
}
