export type UploadContext = {
  fileName: string;
  contentType: string;
};

export function getPublicAssetUrl(objectKey: string) {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;

  if (!endpoint || !bucket) {
    return null;
  }

  return `${endpoint}/${bucket}/${objectKey}`;
}

export async function createPresignedUpload(_context: UploadContext) {
  // MVP placeholder: structure ready for MinIO/S3 presigned uploads.
  return null;
}
