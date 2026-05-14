import { getTheme } from "@/lib/themes";
import type { Page } from "@/@types";

type Props = { page: Page };

export function SlugPageView({ page }: Props) {
  const theme = getTheme(page.themeId);
  const scope = `sp-${page.id}`;

  return (
    <div id={scope}>
      <style>{`
        #${scope} {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4rem 1.5rem;
          background-color: ${theme.background};
          color: ${theme.foreground};
          font-family: inherit;
        }
        #${scope} .sp-inner {
          width: 100%;
          max-width: 28rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          text-align: center;
        }
        #${scope} .sp-avatar {
          height: 6rem;
          width: 6rem;
          border-radius: 9999px;
          object-fit: cover;
        }
        #${scope} .sp-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: ${theme.foreground};
        }
        #${scope} .sp-bio {
          font-size: 0.875rem;
          margin: 0.5rem 0 0;
          color: ${theme.foreground};
          opacity: 0.65;
        }
        #${scope} .sp-links {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        #${scope} .sp-link {
          display: block;
          border-radius: 0.5rem;
          border: 1px solid ${theme.cardBorder};
          background-color: ${theme.cardBg};
          color: ${theme.foreground};
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: background-color 0.15s, border-color 0.15s;
        }
        #${scope} .sp-link:hover {
          border-color: ${theme.accent};
          background-color: ${theme.accent}26;
        }
      `}</style>

      <div className="sp-inner">
        {page.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={page.image} alt={page.title} className="sp-avatar" />
        )}

        <div>
          <h1 className="sp-name">{page.title}</h1>
          {page.bio && <p className="sp-bio">{page.bio}</p>}
        </div>

        <div className="sp-links">
          {page.links?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-link"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}