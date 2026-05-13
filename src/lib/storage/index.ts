import { S3StorageProvider } from "./providers/s3";
import type { StorageProvider } from "./types";

export type { StorageProvider, UploadParams, UploadResult } from "./types";

// Singleton — re-used across the Node.js process lifetime.
let _storage: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!_storage) {
    // Swap this factory for a different provider when needed, e.g.:
    //   if (process.env.STORAGE_PROVIDER === "gcs") return new GCSStorageProvider();
    _storage = new S3StorageProvider();
  }
  return _storage;
}
