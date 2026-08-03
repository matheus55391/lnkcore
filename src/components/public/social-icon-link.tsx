import { detectSocialPlatform } from "@/lib/social-platforms";
import { SocialPlatformIcon } from "@/components/public/social-platform-icon";

type Props = {
  url: string;
  color: string;
  size?: number;
};

export function SocialIconLink({ url, color, size = 20 }: Props) {
  const platform = detectSocialPlatform(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform.label}
      title={platform.label}
      className="sp-social-link"
      style={{ color, width: size, height: size }}
    >
      <SocialPlatformIcon
        platformId={platform.id}
        className="sp-social-svg"
        color={color}
      />
    </a>
  );
}
