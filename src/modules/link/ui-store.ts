"use client";

import { create } from "zustand";

type LinkUiState = {
  selectedLinkId: string | null;
  setSelectedLinkId: (linkId: string | null) => void;
};

export const useLinkUiStore = create<LinkUiState>((set) => ({
  selectedLinkId: null,
  setSelectedLinkId: (selectedLinkId) => set({ selectedLinkId }),
}));
