import { getStorage } from "@/lib/storage";

/** Best-effort delete of a public image URL from object storage. */
export function deleteStoredImage(imageUrl: string | null | undefined): void {
  if (!imageUrl) return;

  const storage = getStorage();
  const key = storage.keyFromUrl(imageUrl);
  if (!key) return;

  storage.delete(key).catch((err) =>
    console.error("[storage] Failed to delete image:", key, err)
  );
}
