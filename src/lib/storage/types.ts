export type UploadParams = {
  /** Storage key / path (e.g. "pages/clx123/avatar.png") */
  key: string;
  body: Buffer;
  contentType: string;
};

export type UploadResult = {
  key: string;
  /** Publicly accessible URL for the stored object */
  url: string;
};

export interface StorageProvider {
  upload(params: UploadParams): Promise<UploadResult>;
  delete(key: string): Promise<void>;
  objectExists(key: string): Promise<boolean>;
  countByPrefix(prefix: string): Promise<number>;
  /** Returns the public URL for an existing key without re-uploading */
  publicUrl(key: string): string;
  /** Extracts the storage key from a public URL. Returns null if the URL doesn't belong to this storage. */
  keyFromUrl(url: string): string | null;
}
