import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LogoTheme } from "@/components/logo-theme";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { AuthLightScope } from "@/components/auth/auth-light-scope";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthLightScope>
      <main className="auth grid min-h-dvh lg:grid-cols-2">
        <section className="auth-form-pane relative flex flex-col px-6 py-8 sm:px-10">
          <header className="flex items-center lg:invisible lg:h-8">
            <Link href="/" className="flex items-center gap-2">
              <LogoTheme force="light" />
              <span className="text-lg font-extrabold tracking-tight text-[#12160f]">
                MakeBio
              </span>
            </Link>
          </header>

          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 py-10">
            {children}
          </div>
        </section>

        <AuthBrandPanel />
      </main>
    </AuthLightScope>
  );
}
