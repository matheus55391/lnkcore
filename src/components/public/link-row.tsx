import type { Link } from "@/@types";
import { LinkAdornmentIcon, isLinkIconValue } from "@/lib/link-adornments";

type Props = {
  link: Link;
  className: string;
};

export function LinkRow({ link, className }: Props) {
  const featured = link.type === "FEATURED";
  const hasIcon = isLinkIconValue(link.emoji);
  const hasEmoji = Boolean(link.emoji) && !hasIcon;
  const hasImage = Boolean(link.image);
  const hasMedia = hasImage || hasIcon || hasEmoji;
  const featuredClass = featured
    ? hasImage
      ? " sp-link-featured sp-link-featured-photo"
      : " sp-link-featured"
    : "";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className}${featuredClass}`}
      data-has-thumb={!featured && hasMedia ? "true" : undefined}
    >
      {featured ? (
        <FeaturedMedia
          image={link.image}
          emoji={link.emoji}
          hasImage={hasImage}
          hasIcon={hasIcon}
          hasEmoji={hasEmoji}
        />
      ) : (
        <ClassicThumb
          image={link.image}
          emoji={link.emoji}
          hasImage={hasImage}
          hasIcon={hasIcon}
          hasEmoji={hasEmoji}
        />
      )}
      <span className="sp-link-label">{link.title}</span>
    </a>
  );
}

type MediaProps = {
  image: string | null;
  emoji: string | null;
  hasImage: boolean;
  hasIcon: boolean;
  hasEmoji: boolean;
};

function ClassicThumb({
  image,
  emoji,
  hasImage,
  hasIcon,
  hasEmoji,
}: MediaProps) {
  if (hasImage) {
    return (
      <span className="sp-link-thumb sp-link-thumb-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image!} alt="" />
      </span>
    );
  }

  if (hasIcon) {
    return (
      <span className="sp-link-thumb sp-link-thumb-icon">
        <LinkAdornmentIcon value={emoji} className="sp-link-lucide" />
      </span>
    );
  }

  if (hasEmoji) {
    return <span className="sp-link-thumb sp-link-thumb-emoji">{emoji}</span>;
  }

  return null;
}

function FeaturedMedia({
  image,
  emoji,
  hasImage,
  hasIcon,
  hasEmoji,
}: MediaProps) {
  const chip =
    hasImage && (hasIcon || hasEmoji) ? (
      <span className="sp-link-chip">
        {hasIcon ? (
          <LinkAdornmentIcon value={emoji} className="sp-link-lucide" />
        ) : (
          emoji
        )}
      </span>
    ) : null;

  if (hasImage) {
    return (
      <>
        <span className="sp-link-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image!} alt="" />
        </span>
        {chip}
      </>
    );
  }

  if (hasIcon) {
    return (
      <span className="sp-link-cover sp-link-cover-symbol">
        <LinkAdornmentIcon value={emoji} className="sp-link-lucide" />
      </span>
    );
  }

  if (hasEmoji) {
    return (
      <span className="sp-link-cover sp-link-cover-symbol">{emoji}</span>
    );
  }

  return null;
}
