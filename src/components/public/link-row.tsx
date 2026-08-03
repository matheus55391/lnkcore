import type { Link } from "@/@types";
import { getLinkIconComponent, isLinkIconValue } from "@/lib/link-adornments";

type Props = {
  link: Link;
  className: string;
};

export function LinkRow({ link, className }: Props) {
  const Icon = getLinkIconComponent(link.emoji);
  const hasEmoji = Boolean(link.emoji) && !isLinkIconValue(link.emoji);
  const hasImage = Boolean(link.image);
  const hasLeft = hasImage || Boolean(Icon) || hasEmoji;

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
      ) : Icon ? (
        <span className="sp-link-thumb sp-link-thumb-icon">
          <Icon className="sp-link-lucide" />
        </span>
      ) : hasEmoji ? (
        <span className="sp-link-thumb sp-link-thumb-emoji">{link.emoji}</span>
      ) : null}
      <span className="sp-link-label">{link.title}</span>
    </a>
  );
}
