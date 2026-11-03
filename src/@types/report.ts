export const ReportReason = {
  SPAM: "spam",
  ILLEGAL_CONTENT: "conteudo-ilegal",
  HARASSMENT: "assedio",
  INAPPROPRIATE: "improprio",
  INTELLECTUAL_PROPERTY: "propriedade-intelectual",
  OTHER: "outro",
} as const;

export type ReportReason =
  (typeof ReportReason)[keyof typeof ReportReason];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.SPAM]: "Spam ou golpe",
  [ReportReason.ILLEGAL_CONTENT]: "Conteúdo ilegal",
  [ReportReason.HARASSMENT]: "Assédio ou ódio",
  [ReportReason.INAPPROPRIATE]: "Conteúdo impróprio",
  [ReportReason.INTELLECTUAL_PROPERTY]: "Violação de propriedade intelectual",
  [ReportReason.OTHER]: "Outro",
};
