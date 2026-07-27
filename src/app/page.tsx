import { getSession } from "@/utils/session";
import { LandingView } from "@/components/landing/landing-view";

export default async function Home() {
  const session = await getSession();

  return (
    <LandingView
      signedIn={Boolean(session)}
      userLabel={
        session ? (session.user.name ?? session.user.email ?? null) : null
      }
    />
  );
}
