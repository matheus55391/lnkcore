import type { Link } from "@/@types";
import { LinkAdornmentIcon, isLinkIconValue } from "@/lib/link-adornments";

type Props = {
  link: Link;
  className: string;
};

export function LinkRow({ link, className }: Props) {
  const hasIcon = isLinkIconValue(link.emoji);
  const hasEmoji = Boolean(link.emoji) && !hasIcon;
  const hasImage = Boolean(link.image);
  const hasLeft = hasImage || hasIcon || hasEmoji;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-has-thumb={hasLeft ? "true" : undefined}
    >
      {hasImage ? (
        <span className="sp-link-thumb sp-link-thumb-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={link.image!} alt="" />
        </span>
      ) : hasIcon ? (
        <span className="sp-link-thumb sp-link-thumb-icon">
          <LinkAdornmentIcon value={link.emoji} className="sp-link-lucide" />
        </span>
      ) : hasEmoji ? (
        <span className="sp-link-thumb sp-link-thumb-emoji">{link.emoji}</span>
      ) : null}
      <span className="sp-link-label">{link.title}</span>
    </a>
  );
}
