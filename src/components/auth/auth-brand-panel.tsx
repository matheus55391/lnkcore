import Link from "next/link";
import { Link2, Palette, Share2 } from "lucide-react";
import { LogoTheme } from "@/components/logo-theme";

const HIGHLIGHTS = [
  {
    icon: Palette,
    text: "Temas prontos e editor direto — monte a bio sem código.",
  },
  {
    icon: Link2,
    text: "Links clássicos e redes sociais num endereço único.",
  },
  {
    icon: Share2,
    text: "Compartilhe makebio.com.br/seunome na bio do Instagram e TikTok.",
  },
] as const;

export function AuthBrandPanel() {
  return (
    <aside className="auth-brand relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 size-72 rounded-full bg-[#c8f14a]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-[#c8f14a]/10 blur-3xl"
      />

      <Link href="/" className="relative flex items-center gap-2">
        <LogoTheme force="dark" />
        <span className="text-lg font-extrabold tracking-tight">MakeBio</span>
      </Link>

      <div className="relative grid max-w-md gap-8">
        <p className="text-3xl leading-tight font-extrabold tracking-tight">
          Seu link na bio,{" "}
          <span className="text-[#c8f14a]">do seu jeito.</span>
        </p>
        <ul className="grid gap-4 text-sm text-white/80">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/10 text-[#c8f14a]">
                <Icon className="size-4" />
              </span>
              <span className="pt-1.5">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/60">
        Link na bio em português
      </p>
    </aside>
  );
}
