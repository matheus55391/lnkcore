"use client";

import { useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { LogoTheme } from "@/components/logo-theme";
import {
  submitPageReport,
  type ReportPageInput,
} from "@/actions/report/submit-page-report";

const REASONS: { value: ReportPageInput["reason"]; label: string }[] = [
  { value: "spam", label: "Spam, golpe ou phishing" },
  { value: "conteudo-ilegal", label: "Conteúdo ilegal" },
  { value: "assedio", label: "Assédio, ameaça ou discurso de ódio" },
  { value: "improprio", label: "Conteúdo impróprio ou ofensivo" },
  {
    value: "propriedade-intelectual",
    label: "Violação de propriedade intelectual",
  },
  { value: "outro", label: "Outro motivo" },
];

export function DenunciarForm() {
  const searchParams = useSearchParams();
  const defaultPageUrl = useMemo(() => {
    const fromQuery =
      searchParams.get("pagina") ?? searchParams.get("url") ?? "";
    try {
      if (!fromQuery) return "";
      const parsed = new URL(fromQuery);
      return parsed.toString();
    } catch {
      return fromQuery;
    }
  }, [searchParams]);

  const [pageUrl, setPageUrl] = useState(defaultPageUrl);
  const [reason, setReason] = useState<ReportPageInput["reason"] | "">("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!reason) {
      setError("Selecione um motivo.");
      return;
    }

    startTransition(async () => {
      const result = await submitPageReport({
        pageUrl,
        reason,
        details,
        email,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="legal-main">
        <h1>Denúncia enviada</h1>
        <p>
          Obrigado. Nossa equipe vai analisar o relato. Não enviamos resposta
          automática a cada denúncia, mas priorizamos casos graves.
        </p>
        <p className="legal-meta">
          <Link href="/">Voltar ao MakeBio</Link>
          {pageUrl ? (
            <>
              {" · "}
              <a href={pageUrl}>Voltar à página denunciada</a>
            </>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <div className="legal-main">
      <h1>Denunciar uma página</h1>
      <p>
        Use este formulário para reportar páginas MakeBio que violem nossas
        regras ou a lei. Relatos falsos ou abusivos também podem ser
        investigados.
      </p>

      <form onSubmit={onSubmit} className="legal-form mt-6 space-y-4">
        <FormField>
          <Label htmlFor="pageUrl">URL da página</Label>
          <Input
            id="pageUrl"
            type="url"
            required
            placeholder="https://www.makebio.com.br/exemplo"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            className="bg-white text-neutral-900 border-neutral-200"
          />
        </FormField>

        <FormField>
          <Label htmlFor="reason">Motivo</Label>
          <select
            id="reason"
            required
            value={reason}
            onChange={(e) =>
              setReason(e.target.value as ReportPageInput["reason"])
            }
            className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          >
            <option value="" disabled>
              Selecione…
            </option>
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField>
          <Label htmlFor="details">Detalhes (opcional)</Label>
          <textarea
            id="details"
            rows={4}
            maxLength={2000}
            placeholder="Descreva o problema com o máximo de contexto possível."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full resize-none rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          />
        </FormField>

        <FormField>
          <Label htmlFor="email">Seu e-mail (opcional)</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-neutral-900 border-neutral-200"
          />
          <p className="text-xs text-neutral-500">
            Só usamos para esclarecimentos sobre esta denúncia.
          </p>
        </FormField>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button
          type="submit"
          className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Enviar denúncia"
          )}
        </Button>
      </form>
    </div>
  );
}

export function DenunciarPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link href="/" className="legal-brand">
          <LogoTheme force="light" />
          <span>MakeBio</span>
        </Link>
        <Link href="/" className="legal-back">
          Voltar ao início
        </Link>
      </header>
      {children}
      <footer className="legal-footer">
        <p>© {new Date().getFullYear()} MakeBio</p>
        <div>
          <Link href="/privacidade">Privacidade</Link>
          <span aria-hidden> · </span>
          <Link href="/">Início</Link>
        </div>
      </footer>
    </div>
  );
}
