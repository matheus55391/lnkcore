import type { Link } from "@/@types";
import { LinkRow } from "@/components/public/link-row";

type Props = {
  links: Link[];
};

export function PublicLinksList({ links }: Props) {
  if (links.length === 0) return null;

  return (
    <div className="sp-links">
      {links.map((link) => (
        <LinkRow key={link.id} link={link} className="sp-link" />
      ))}
    </div>
  );
}
