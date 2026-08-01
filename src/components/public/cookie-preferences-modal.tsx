"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useEscapeKey } from "@/hooks/use-escape-key";

const STORAGE_KEY = "lnkcore-cookie-prefs";

type CookiePrefs = {
  performance: boolean;
  functional: boolean;
  advertising: boolean;
};

const DEFAULT_PREFS: CookiePrefs = {
  performance: false,
  functional: false,
  advertising: false,
};

function loadPrefs(): CookiePrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: CookiePrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

type Props = {
  open: boolean;
  onClose: () => void;
};

type ContentProps = { onClose: () => void };

function CookiePreferencesModalContent({ onClose }: ContentProps) {
  const [prefs, setPrefs] = useState<CookiePrefs>(loadPrefs);

  useEscapeKey(onClose);

  function toggle(key: keyof CookiePrefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function acceptAll() {
    const next = { performance: true, functional: true, advertising: true };
    setPrefs(next);
    savePrefs(next);
    onClose();
  }

  function rejectAll() {
    const next = DEFAULT_PREFS;
    setPrefs(next);
    savePrefs(next);
    onClose();
  }

  function save() {
    savePrefs(prefs);
    onClose();
  }

  return (
    <div className="sp-modal-root" role="presentation" onClick={onClose}>
      <div
        className="sp-modal sp-modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sp-modal-header">
          <h2 id="cookie-modal-title">Preferências de cookies</h2>
          <button
            type="button"
            className="sp-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="sp-cookie-intro">
          Usamos cookies e tecnologias semelhantes para melhorar sua
          experiência, analisar o uso do site, personalizar conteúdo e, se
          autorizado, para publicidade. Gerencie suas escolhas abaixo.
        </p>

        <ul className="sp-cookie-list">
          <li className="sp-cookie-row">
            <div>
              <p className="sp-cookie-name">Cookies estritamente necessários</p>
              <p className="sp-cookie-desc">
                Obrigatórios para o funcionamento do site (ex.: sessão).
              </p>
            </div>
            <span className="sp-cookie-always">Sempre ativos</span>
          </li>
          {(
            [
              ["performance", "Cookies de desempenho"],
              ["functional", "Cookies funcionais"],
              ["advertising", "Cookies de publicidade"],
            ] as const
          ).map(([key, label]) => (
            <li key={key} className="sp-cookie-row">
              <div>
                <p className="sp-cookie-name">{label}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[key]}
                className={`sp-toggle ${prefs[key] ? "sp-toggle-on" : ""}`}
                onClick={() => toggle(key)}
              >
                <span className="sp-toggle-knob" />
              </button>
            </li>
          ))}
        </ul>

        <div className="sp-cookie-actions">
          <button type="button" className="sp-cookie-btn" onClick={save}>
            Salvar escolhas
          </button>
          <button type="button" className="sp-cookie-btn" onClick={acceptAll}>
            Aceitar todos
          </button>
          <button type="button" className="sp-cookie-btn" onClick={rejectAll}>
            Recusar todos
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesModal({ open, onClose }: Props) {
  if (!open) return null;
  return <CookiePreferencesModalContent onClose={onClose} />;
}
