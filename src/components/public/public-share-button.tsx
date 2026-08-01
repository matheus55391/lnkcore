"use client";

import { Share } from "lucide-react";

type Props = {
  onClick: () => void;
};

export function PublicShareButton({ onClick }: Props) {
  return (
    <div className="sp-topbar">
      <button
        type="button"
        className="sp-icon-btn"
        aria-label="Compartilhar"
        onClick={onClick}
      >
        <Share className="h-4 w-4" />
      </button>
    </div>
  );
}
