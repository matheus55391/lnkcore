import type { SocialPlatformId } from "@/lib/social-platforms";
import {
  GenericLinkIcon,
  SOCIAL_PLATFORM_ICONS,
} from "@/components/public/social-platform-svgs";

type Props = {
  platformId: SocialPlatformId;
  className?: string;
  color?: string;
};

export function SocialPlatformIcon({ platformId, className, color }: Props) {
  const Icon = SOCIAL_PLATFORM_ICONS[platformId] ?? GenericLinkIcon;
  return <Icon className={className} color={color} />;
}
