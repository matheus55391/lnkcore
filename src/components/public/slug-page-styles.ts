import type { PageLayout } from "@/@types";
import type { Theme } from "@/lib/themes";

/** CSS/HTML hook. Must stay lowercase — `[data-layout="COVER"]` never matches. */
export function slugLayoutAttr(
  layout: PageLayout | null | undefined
): "cover" | "classic" {
  return layout === "COVER" ? "cover" : "classic";
}

export function getSlugPageStyles(scope: string, theme: Theme): string {
  return `
    #${scope} {
      --sp-fg: ${theme.foreground};
      --sp-bg: ${theme.background};
      --sp-card: ${theme.cardBg};
      --sp-border: ${theme.cardBorder};
      --sp-accent: ${theme.accent};
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.25rem 1.5rem 3rem;
      background-color: var(--sp-bg);
      color: var(--sp-fg);
      font-family: inherit;
      position: relative;
    }
    #${scope}[data-preview="true"] {
      min-height: 100%;
      box-sizing: border-box;
      padding: 1.25rem 1.5rem 1.5rem;
    }
    #${scope} .sp-topbar {
      width: 100%;
      max-width: 28rem;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }
    #${scope} .sp-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      border: 1px solid color-mix(in srgb, var(--sp-fg) 18%, transparent);
      background: color-mix(in srgb, var(--sp-fg) 8%, transparent);
      color: var(--sp-fg);
      cursor: pointer;
      transition: background 0.15s;
    }
    #${scope} .sp-icon-btn:hover {
      background: color-mix(in srgb, var(--sp-fg) 16%, transparent);
    }
    #${scope} .sp-inner {
      width: 100%;
      max-width: 28rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      text-align: center;
      flex: 1;
    }
    #${scope} .sp-avatar {
      height: 6rem;
      width: 6rem;
      border-radius: 9999px;
      object-fit: cover;
    }
    #${scope} .sp-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--sp-fg);
    }
    #${scope} .sp-bio {
      font-size: 0.875rem;
      margin: 0.5rem 0 0;
      color: var(--sp-fg);
      opacity: 0.65;
    }
    #${scope} .sp-socials {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      padding: 0.15rem 0;
    }
    #${scope} .sp-social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      opacity: 0.9;
      transition: opacity 0.15s;
    }
    #${scope} .sp-social-link:hover {
      opacity: 1;
    }
    #${scope} .sp-social-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    #${scope} .sp-links {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    #${scope} .sp-link {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 3.5rem;
      border-radius: 0.75rem;
      border: 1px solid var(--sp-border);
      background-color: var(--sp-card);
      color: var(--sp-fg);
      padding: 0.75rem 3.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: background-color 0.15s, border-color 0.15s;
    }
    #${scope} .sp-link:hover {
      border-color: var(--sp-accent);
      background-color: color-mix(in srgb, var(--sp-accent) 15%, var(--sp-card));
    }
    #${scope} .sp-link-thumb {
      position: absolute;
      left: 0.5rem;
      top: 0;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 9999px;
      object-fit: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    #${scope} .sp-link-thumb-icon,
    #${scope} .sp-link-thumb-emoji {
      background: color-mix(in srgb, var(--sp-fg) 10%, transparent);
      font-size: 1.05rem;
    }
    #${scope} .sp-link-thumb-image {
      overflow: hidden;
    }
    #${scope} .sp-link-thumb-image img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #${scope} .sp-link-lucide {
      width: 1.05rem;
      height: 1.05rem;
    }
    #${scope} .sp-link-label {
      display: block;
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${scope} .sp-link-featured {
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-end;
      gap: 0;
      min-height: 4.5rem;
      padding: 0.85rem 1rem;
      overflow: hidden;
    }
    #${scope} .sp-link-featured-photo {
      aspect-ratio: 4 / 5;
      min-height: 0;
      padding: 0;
      border: none;
      background: #111;
      color: #fff;
    }
    #${scope} .sp-link-featured-photo:hover {
      border-color: transparent;
      background: #111;
    }
    #${scope} .sp-link-featured-photo .sp-link-cover img {
      transition: transform 0.35s ease;
    }
    #${scope} .sp-link-featured-photo:hover .sp-link-cover img {
      transform: scale(1.04);
    }
    #${scope} .sp-link-featured .sp-link-cover {
      display: block;
      width: 100%;
      overflow: hidden;
      background: color-mix(in srgb, var(--sp-fg) 8%, transparent);
    }
    #${scope} .sp-link-featured-photo .sp-link-cover {
      position: absolute;
      inset: 0;
      border-radius: 0;
    }
    #${scope} .sp-link-featured-photo .sp-link-cover::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.72) 0%,
        rgba(0, 0, 0, 0.18) 42%,
        transparent 68%
      );
      pointer-events: none;
    }
    #${scope} .sp-link-featured .sp-link-cover img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #${scope} .sp-link-featured .sp-link-cover-symbol {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.35rem;
      min-height: 6rem;
    }
    #${scope} .sp-link-featured .sp-link-cover-symbol .sp-link-lucide {
      width: 2rem;
      height: 2rem;
    }
    #${scope} .sp-link-featured-photo .sp-link-label {
      position: relative;
      z-index: 1;
      padding: 1.15rem 1rem 1rem;
      font-weight: 600;
      text-shadow: 0 1px 10px rgba(0, 0, 0, 0.55);
    }
    #${scope} .sp-link-chip {
      position: absolute;
      top: 0.7rem;
      left: 0.7rem;
      z-index: 2;
      width: 1.85rem;
      height: 1.85rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      font-size: 0.85rem;
      pointer-events: none;
    }
    #${scope} .sp-link-chip .sp-link-lucide {
      width: 0.95rem;
      height: 0.95rem;
    }
    #${scope} .sp-social-brand {
      width: 2.55rem;
      height: 2.55rem;
      border-radius: 9999px;
      padding: 0.58rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.28);
    }
    #${scope} .sp-social-brand .sp-social-svg {
      width: 100%;
      height: 100%;
    }
    #${scope}[data-layout="cover"] {
      padding: 0 0 2.25rem;
      overflow-x: hidden;
    }
    #${scope}[data-layout="cover"][data-preview="true"] {
      padding: 0 0 1.5rem;
      overflow-x: visible;
    }
    #${scope}[data-layout="cover"] .sp-backdrop {
      display: none;
    }
    #${scope}[data-layout="cover"] .sp-topbar {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 4;
      width: 100%;
      max-width: 28rem;
      margin: 0;
      padding: 0.85rem 0.85rem 0 0;
      transform: translateX(-50%);
    }
    #${scope}[data-layout="cover"][data-preview="true"] .sp-topbar {
      padding-top: 3.5rem;
    }
    #${scope}[data-layout="cover"] .sp-icon-btn {
      width: 2.35rem;
      height: 2.35rem;
      border-radius: 9999px;
      border-color: transparent;
      background: rgba(0, 0, 0, 0.38);
      color: #fff;
      backdrop-filter: blur(8px);
    }
    #${scope}[data-layout="cover"] .sp-hero {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 28rem;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      background: color-mix(in srgb, var(--sp-fg) 10%, var(--sp-bg));
    }
    #${scope}[data-layout="cover"] .sp-cover,
    #${scope}[data-layout="cover"] .sp-cover-empty {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }
    #${scope}[data-layout="cover"] .sp-hero-fade {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        var(--sp-bg) 0%,
        color-mix(in srgb, var(--sp-bg) 42%, transparent) 38%,
        transparent 68%
      );
      pointer-events: none;
    }
    #${scope}[data-layout="cover"] .sp-hero-meta {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      padding: 0 1.1rem 2.35rem;
      text-align: center;
    }
    #${scope}[data-layout="cover"] .sp-handle {
      margin: -0.15rem 0 0;
      font-size: 0.82rem;
      opacity: 0.72;
    }
    #${scope}[data-layout="cover"] .sp-hero-meta .sp-bio {
      margin: 0.15rem 0 0;
      max-width: 22rem;
      opacity: 0.82;
      line-height: 1.4;
    }
    #${scope}[data-layout="cover"] .sp-inner {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 28rem;
      margin-top: -1.6rem;
      padding: 0 1.1rem 0;
      gap: 0.9rem;
    }
    #${scope}[data-layout="cover"] .sp-bio {
      margin: 0;
      opacity: 0.78;
    }
    #${scope}[data-layout="cover"] .sp-socials {
      gap: 0.55rem;
      padding: 0.2rem 0 0;
    }
    #${scope}[data-layout="cover"] .sp-links {
      gap: 0.7rem;
    }
    #${scope}[data-layout="cover"] .sp-link-featured-photo {
      border-radius: 1rem;
    }
    #${scope}[data-layout="cover"] .sp-footer {
      position: relative;
      z-index: 1;
      max-width: 28rem;
      padding-left: 1.1rem;
      padding-right: 1.1rem;
    }
    @media (min-width: 40rem) {
      #${scope}[data-layout="cover"]:not([data-preview="true"]) .sp-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
      }
      #${scope}[data-layout="cover"]:not([data-preview="true"]) .sp-backdrop img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(52px) saturate(1.08);
        transform: scale(1.14);
        opacity: 0.32;
      }
    }
    #${scope} .sp-footer {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      margin-top: auto;
      padding: 1.5rem 0.75rem 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      column-gap: 0.75rem;
      row-gap: 0.35rem;
      font-size: 0.7rem;
      line-height: 1.35;
      text-align: center;
      opacity: 0.55;
    }
    #${scope} .sp-footer button,
    #${scope} .sp-footer a {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font: inherit;
      padding: 0;
      text-decoration: none;
      white-space: nowrap;
    }
    #${scope} .sp-footer button:hover,
    #${scope} .sp-footer a:hover {
      opacity: 1;
      text-decoration: underline;
    }

    #${scope} .sp-modal-root {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.55);
    }
    #${scope} .sp-modal {
      width: 100%;
      max-width: 22rem;
      max-height: min(90dvh, 40rem);
      overflow-y: auto;
      background: #fff;
      color: #111;
      border-radius: 1rem;
      padding: 1.25rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    }
    #${scope} .sp-modal-wide {
      max-width: 26rem;
    }
    #${scope} .sp-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    #${scope} .sp-modal-header h2 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }
    #${scope} .sp-modal-close {
      display: inline-flex;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #111;
      padding: 0.25rem;
      border-radius: 0.375rem;
    }
    #${scope} .sp-share-preview {
      border-radius: 0.75rem;
      padding: 1.25rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 1.25rem;
    }
    #${scope} .sp-share-avatar {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 9999px;
      object-fit: cover;
    }
    #${scope} .sp-share-avatar-empty {
      background: color-mix(in srgb, var(--sp-fg) 20%, transparent);
    }
    #${scope} .sp-share-title {
      margin: 0.35rem 0 0;
      font-weight: 700;
      font-size: 1rem;
    }
    #${scope} .sp-share-handle {
      margin: 0;
      font-size: 0.8rem;
      opacity: 0.7;
    }
    #${scope} .sp-share-row {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    #${scope} .sp-share-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      min-width: 4rem;
      text-decoration: none;
      color: #111;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font: inherit;
    }
    #${scope} .sp-share-circle-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    #${scope} .sp-share-circle-label {
      font-size: 0.7rem;
    }
    #${scope} .sp-cookie-intro {
      font-size: 0.85rem;
      line-height: 1.45;
      color: #444;
      margin: 0 0 1rem;
    }
    #${scope} .sp-cookie-list {
      list-style: none;
      margin: 0 0 1rem;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    #${scope} .sp-cookie-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    #${scope} .sp-cookie-name {
      margin: 0;
      font-weight: 600;
      font-size: 0.9rem;
    }
    #${scope} .sp-cookie-desc {
      margin: 0.15rem 0 0;
      font-size: 0.75rem;
      color: #666;
    }
    #${scope} .sp-cookie-always {
      font-size: 0.75rem;
      color: #666;
      white-space: nowrap;
    }
    #${scope} .sp-toggle {
      width: 2.75rem;
      height: 1.5rem;
      border-radius: 9999px;
      border: none;
      background: #ccc;
      position: relative;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    #${scope} .sp-toggle-on {
      background: #111;
    }
    #${scope} .sp-toggle-knob {
      position: absolute;
      top: 0.15rem;
      left: 0.15rem;
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 9999px;
      background: #fff;
      transition: transform 0.15s;
    }
    #${scope} .sp-toggle-on .sp-toggle-knob {
      transform: translateX(1.25rem);
    }
    #${scope} .sp-cookie-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    #${scope} .sp-cookie-btn {
      width: 100%;
      padding: 0.7rem 1rem;
      border-radius: 9999px;
      border: 1px solid #111;
      background: #fff;
      color: #111;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
    }
    #${scope} .sp-cookie-btn:hover {
      background: #f5f5f5;
    }
    #${scope} .sp-about-header {
      justify-content: center;
      position: relative;
      margin-bottom: 1.25rem;
    }
    #${scope} .sp-about-header h2 {
      text-align: center;
      width: 100%;
      padding: 0 2.5rem;
    }
    #${scope} .sp-about-close {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2rem;
      height: 2rem;
      border-radius: 9999px;
      background: #f0f0f0;
      align-items: center;
      justify-content: center;
    }
    #${scope} .sp-about-profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
      margin-bottom: 0;
    }
    #${scope} .sp-about-avatar {
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 9999px;
      object-fit: cover;
    }
    #${scope} .sp-about-avatar-empty {
      background: #e5e5e5;
    }
    #${scope} .sp-about-name {
      margin: 0.25rem 0 0;
      font-weight: 700;
      font-size: 1.1rem;
      color: #111;
    }
    #${scope} .sp-about-intro {
      margin: 0.35rem 0 0;
      font-size: 0.8rem;
      line-height: 1.45;
      color: #666;
      max-width: 20rem;
    }
    #${scope} .sp-about-divider {
      border: none;
      border-top: 1px solid #eee;
      margin: 1.15rem 0;
    }
    #${scope} .sp-about-body {
      text-align: left;
    }
    #${scope} .sp-about-joined {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      color: #111;
    }
    #${scope} .sp-about-joined-label {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.35;
    }
    #${scope} .sp-about-text {
      font-size: 0.875rem;
      line-height: 1.5;
      color: #444;
      margin: 0 0 0.75rem;
    }
    #${scope} .sp-about-socials {
      margin: 0 0 1rem;
      padding-left: 1.25rem;
      font-size: 0.875rem;
      color: #333;
      line-height: 1.5;
    }
    #${scope} .sp-about-more {
      font-size: 0.85rem;
      color: #666;
      text-decoration: none;
    }
    #${scope} .sp-about-more:hover {
      text-decoration: underline;
      color: #111;
    }
  `;
}
