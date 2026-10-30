import type { Link } from "@/@types";
import { SocialIconLink } from "@/components/public/social-icon-link";

type Props = {
  links: Link[];
  color: string;
  variant?: "plain" | "brand";
};

export function PublicSocialRow({ links, color, variant = "plain" }: Props) {
  if (links.length === 0) return null;

  return (
    <div className="sp-socials" role="navigation" aria-label="Redes sociais">
      {links.map((link) => (
        <SocialIconLink
          key={link.id}
          url={link.url}
          color={color}
          size={variant === "brand" ? 18 : 20}
          variant={variant}
        />
      ))}
    </div>
  );
}
