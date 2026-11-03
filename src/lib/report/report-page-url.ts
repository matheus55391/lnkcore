const ALLOWED_REPORT_HOSTS = new Set([
  "makebio.com.br",
  "www.makebio.com.br",
]);

/** Canonical MakeBio page URLs only (abuse reports). */
export function isAllowedReportPageUrl(pageUrl: string): boolean {
  try {
    const parsed = new URL(pageUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    return ALLOWED_REPORT_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}
