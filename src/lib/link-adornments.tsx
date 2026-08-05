import {
  Briefcase,
  Camera,
  Gamepad2,
  Heart,
  Home,
  Link as LinkLucide,
  type LucideIcon,
  Music,
  Plane,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  BookOpen,
  Flame,
  Video,
} from "lucide-react";

/** Lucide icons available as link icons */
export const LINK_ICON_PRESETS = [
  { id: "link", label: "Link", Icon: LinkLucide },
  { id: "sparkles", label: "Sparkles", Icon: Sparkles },
  { id: "flame", label: "Fire", Icon: Flame },
  { id: "camera", label: "Camera", Icon: Camera },
  { id: "video", label: "Video", Icon: Video },
  { id: "music", label: "Music", Icon: Music },
  { id: "book", label: "Book", Icon: BookOpen },
  { id: "cart", label: "Shop", Icon: ShoppingCart },
  { id: "briefcase", label: "Work", Icon: Briefcase },
  { id: "game", label: "Game", Icon: Gamepad2 },
  { id: "plane", label: "Travel", Icon: Plane },
  { id: "home", label: "Home", Icon: Home },
  { id: "heart", label: "Heart", Icon: Heart },
  { id: "star", label: "Star", Icon: Star },
  { id: "target", label: "Target", Icon: Target },
] as const;

/** Emoji options treated as link icons */
export const LINK_EMOJI_ICONS = [
  "🔗",
  "✨",
  "🔥",
  "💫",
  "📸",
  "🎥",
  "🎵",
  "📚",
  "🛒",
  "💼",
  "🎮",
  "✈️",
  "🏠",
  "❤️",
  "⭐",
  "🎯",
] as const;

export type LinkIconId = (typeof LINK_ICON_PRESETS)[number]["id"];

const ICON_PREFIX = "icon:";

export function toLinkIconValue(id: LinkIconId): string {
  return `${ICON_PREFIX}${id}`;
}

export function isLinkIconValue(value: string | null | undefined): boolean {
  return Boolean(value?.startsWith(ICON_PREFIX));
}

export function parseLinkIconId(
  value: string | null | undefined
): LinkIconId | null {
  if (!value?.startsWith(ICON_PREFIX)) return null;
  const id = value.slice(ICON_PREFIX.length);
  return LINK_ICON_PRESETS.some((p) => p.id === id)
    ? (id as LinkIconId)
    : null;
}

const LINK_ICON_BY_ID: Record<LinkIconId, LucideIcon> = {
  link: LinkLucide,
  sparkles: Sparkles,
  flame: Flame,
  camera: Camera,
  video: Video,
  music: Music,
  book: BookOpen,
  cart: ShoppingCart,
  briefcase: Briefcase,
  game: Gamepad2,
  plane: Plane,
  home: Home,
  heart: Heart,
  star: Star,
  target: Target,
};

/** Renders a Lucide link icon without assigning a component during render. */
export function LinkAdornmentIcon({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  const id = parseLinkIconId(value);
  if (!id) return null;
  const Icon = LINK_ICON_BY_ID[id];
  return <Icon className={className} />;
}
