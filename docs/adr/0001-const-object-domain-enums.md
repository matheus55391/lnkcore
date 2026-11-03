# 0001. Use const objects as domain enums

Date: 2026-11-03
Status: proposed

## Context
Domain values (`Plan`, `LinkType`, `FeaturedSize`, `PageLayout`, …) appear in
Prisma, Zod, server actions and UI. Comparing against raw string literals
(`plan === "FREE"`) duplicates magic values, drifts from schema and hides
typos until runtime.

## Options considered
1. **TypeScript `enum`** — native, but emits runtime + has quirks with tree-shaking
   and Prisma string unions. Pros: familiar. Cons: dual numeric/string forms;
   awkward with `as const` Zod/Prisma.
2. **Const object + derived union** (`export const Plan = { FREE: "FREE", … } as const;
   export type Plan = …`) — same pattern already used for `LinkType` /
   `PageLayout`. Pros: string values match DB; autocomplete on `Plan.`; no
   numeric enum traps. Cons: must import the value object for comparisons;
   type and value share a name (intentional).
3. **String literals only** — zero ceremony. Pros: short. Cons: no single
   source of truth; easy to mistype in UI.

## Decision
Use const objects with a derived union type for every closed domain set.
Comparisons and defaults use `Plan.FREE` / `LinkType.FEATURED` (etc.), never
`"FREE"` / `"FEATURED"` outside the const definition and Prisma schema.

## Consequences
- Grep for `=== "` on domain values should stay near zero in app code.
- Zod schemas should list `z.enum([Plan.FREE, Plan.PRO])` (or equivalent)
  from the same constants.
- Current const enums: `Plan`, `LinkType`, `FeaturedSize`, `ClassicLinkStyle`,
  `PageLayout`, `SubscriptionStatus`, `PaymentStatus`, `ReportReason`,
  `AdornmentMode`, `EditorSection`, `ContentTab`, `AccountTab`, `DiscordKind`.
- Skip UI-library variants (shadcn `button`/`badge`) and third-party theme
  strings (`next-themes` light/dark).
- Revisit if we adopt a codegen enum bridge from Prisma that already exposes
  a single runtime object we can re-export unchanged.
