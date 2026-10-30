"use client";

import { SlugPageView } from "@/components/page-slug-view";
import { cn } from "@/lib/utils";
import type { Page } from "@/@types";

type Props = {
  page: Page;
  compact?: boolean;
};

export function EditorPhone({ page, compact = false }: Props) {
  return (
    <div
      className={cn("ed-phone-slot", compact && "ed-phone-slot-compact")}
    >
      <div className="ed-phone">
        <span className="ed-phone-btn ed-phone-btn-silent" aria-hidden />
        <span className="ed-phone-btn ed-phone-btn-vol-up" aria-hidden />
        <span className="ed-phone-btn ed-phone-btn-vol-down" aria-hidden />
        <span className="ed-phone-btn ed-phone-btn-power" aria-hidden />
        <div className="ed-phone-chassis">
          <div className="ed-phone-glass">
            <div className="ed-phone-screen">
              <span className="ed-phone-island" aria-hidden>
                <span className="ed-phone-lens" />
              </span>
              <div className="ed-phone-scroll">
                <SlugPageView page={page} preview />
              </div>
              <span className="ed-phone-home" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
