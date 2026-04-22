const allowedProtocols = new Set(["http:", "https:"]);

export function sanitizeUrl(rawUrl: string) {
  try {
    const normalized = rawUrl.trim();
    const parsed = new URL(normalized);
    if (!allowedProtocols.has(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
