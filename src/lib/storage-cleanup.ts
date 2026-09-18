import { getStorage } from "@/lib/storage";
import {
  isOwnedStorageKey,
  keyFromPublicUrl,
} from "@/lib/storage/key-from-url";

export class OwnedImageError extends Error {
  constructor(message = "URL de imagem inválida ou não autorizada.") {
    super(message);
    this.name = "OwnedImageError";
  }
}

/**
 * Ensures `url` resolves to an object key under `${userId}/`.
 * Returns the key on success.
 */
export function assertOwnedImageUrl(url: string, userId: string): string {
  const key = keyFromPublicUrl(url);
  if (!key || !isOwnedStorageKey(key, userId)) {
    throw new OwnedImageError();
  }
  return key;
}

/**
 * Like assertOwnedImageUrl, but allows null/empty (clear image) and undefined
 * (leave unchanged). Returns the normalized value to persist.
 */
export function normalizeOwnedImageUrl(
  url: string | null | undefined,
  userId: string
): string | null | undefined {
  if (url === undefined) return undefined;
  if (url === null || url === "") return null;
  assertOwnedImageUrl(url, userId);
  return url;
}

/** Best-effort delete only when the key is owned by `userId`. */
export function deleteOwnedStoredImage(
  imageUrl: string | null | undefined,
  userId: string
): void {
  if (!imageUrl) return;

  const key = keyFromPublicUrl(imageUrl);
  if (!key || !isOwnedStorageKey(key, userId)) {
    console.error(
      "[storage] Refusing to delete unowned or unknown image key:",
      key ?? imageUrl
    );
    return;
  }

  const storage = getStorage();
  storage.delete(key).catch((err) =>
    console.error("[storage] Failed to delete image:", key, err)
  );
}
