import { LinkIcon } from "lucide-react";
import type { Link } from "@/@types/link";
import { LinkAdornmentIcon, isLinkIconValue } from "@/lib/link-adornments";

type Props = { link: Link };

const thumbClass =
  "bg-muted flex size-9 shrink-0 aspect-square items-center justify-center rounded-full overflow-hidden";

export function LinkManagerItemThumb({ link }: Props) {
  if (link.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={link.image}
        alt=""
        className={`${thumbClass} object-cover`}
      />
    );
  }

  if (isLinkIconValue(link.emoji)) {
    return (
      <span className={thumbClass}>
        <LinkAdornmentIcon
          value={link.emoji}
          className="h-4 w-4 text-muted-foreground"
        />
      </span>
    );
  }

  if (link.emoji) {
    return <span className={`${thumbClass} text-lg`}>{link.emoji}</span>;
  }

  return (
    <span className={thumbClass}>
      <LinkIcon className="h-4 w-4 text-muted-foreground" />
    </span>
  );
}
