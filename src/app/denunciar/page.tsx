import type { Metadata } from "next";
import { Suspense } from "react";
import {
  DenunciarForm,
  DenunciarPageShell,
} from "@/components/legal/denunciar-form";

export const metadata: Metadata = {
  title: "Denunciar uma página",
  description:
    "Reporte páginas MakeBio que violem as regras da comunidade ou a lei.",
};

export default function DenunciarPage() {
  return (
    <DenunciarPageShell>
      <Suspense
        fallback={
          <div className="legal-main">
            <h1>Denunciar uma página</h1>
            <p>Carregando formulário…</p>
          </div>
        }
      >
        <DenunciarForm />
      </Suspense>
    </DenunciarPageShell>
  );
}
