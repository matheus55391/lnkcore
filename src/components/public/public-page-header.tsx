import type { ReactNode } from "react";
import type { PageLayout } from "@/@types";

type Props = {
  title: string;
  bio: string | null;
  image: string | null;
  slug: string;
  layout: PageLayout;
  socials?: ReactNode;
};

export function PublicPageHeader({
  title,
  bio,
  image,
  slug,
  layout,
  socials,
}: Props) {
  if (layout === "COVER") {
    return (
      <header className="sp-hero">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="sp-cover" />
        ) : (
          <span className="sp-cover-empty" aria-hidden />
        )}
        <span className="sp-hero-fade" aria-hidden />
        <div className="sp-hero-meta">
          <h1 className="sp-name">{title}</h1>
          <p className="sp-handle">@{slug}</p>
          {socials}
        </div>
      </header>
    );
  }

  return (
    <>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} className="sp-avatar" />
      )}
      <div>
        <h1 className="sp-name">{title}</h1>
        {bio && <p className="sp-bio">{bio}</p>}
      </div>
    </>
  );
}
