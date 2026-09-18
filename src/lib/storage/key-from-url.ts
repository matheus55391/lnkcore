/** Pure URL→key parsing (no S3 client / credentials required). */

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Extracts the object key from a public storage URL using the same rules as
 * S3StorageProvider. Returns null if the URL is not from our storage.
 */
export function keyFromPublicUrl(url: string): string | null {
  const forcePathStyle =
    (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true";
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION ?? "us-east-1";
  const publicBase = process.env.S3_PUBLIC_URL;
  const bucket = process.env.S3_BUCKET ?? "";

  try {
    if (publicBase) {
      const prefix = `${trimTrailingSlash(publicBase)}/`;
      if (url.startsWith(prefix)) return url.slice(prefix.length);
      return null;
    }
    if (endpoint && (forcePathStyle || endpoint)) {
      if (!bucket) return null;
      const prefix = `${trimTrailingSlash(endpoint)}/${bucket}/`;
      if (url.startsWith(prefix)) return url.slice(prefix.length);
      return null;
    }
    if (!bucket) return null;
    const prefix = `https://${bucket}.s3.${region}.amazonaws.com/`;
    if (url.startsWith(prefix)) return url.slice(prefix.length);
    return null;
  } catch {
    return null;
  }
}

export function isOwnedStorageKey(
  key: string | null | undefined,
  userId: string
): boolean {
  if (!key || !userId) return false;
  return key.startsWith(`${userId}/`);
}
