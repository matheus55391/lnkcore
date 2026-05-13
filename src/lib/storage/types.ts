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
  /** Returns the public URL for an existing key without re-uploading */
  publicUrl(key: string): string;
}
