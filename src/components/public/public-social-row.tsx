import type { Link } from "@/@types";
import { SocialIconLink } from "@/components/public/social-icon-link";

type Props = {
  links: Link[];
  color: string;
};

export function PublicSocialRow({ links, color }: Props) {
  if (links.length === 0) return null;

  return (
    <div className="sp-socials">
      {links.map((link) => (
        <SocialIconLink
          key={link.id}
          url={link.url}
          color={color}
          size={20}
        />
      ))}
    </div>
  );
}
