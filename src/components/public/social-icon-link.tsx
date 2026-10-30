import {
  detectSocialPlatform,
  SOCIAL_BRAND,
} from "@/lib/social-platforms";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";

type Props = {
  url: string;
  color: string;
  size?: number;
  variant?: "plain" | "brand";
};

export function SocialIconLink({
  url,
  color,
  size = 20,
  variant = "plain",
}: Props) {
  const platform = detectSocialPlatform(url);
  const brand = SOCIAL_BRAND[platform.id];
  const branded = variant === "brand";
  const iconColor = branded ? brand.icon : color;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform.label}
      title={platform.label}
      className={branded ? "sp-social-link sp-social-brand" : "sp-social-link"}
      style={
        branded
          ? { background: brand.background, color: brand.icon }
          : { color, width: size, height: size }
      }
    >
      <SocialPlatformIcon
        platformId={platform.id}
        className="sp-social-svg"
        color={iconColor}
      />
    </a>
  );
}
