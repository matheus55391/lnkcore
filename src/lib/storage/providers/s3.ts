import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import type { StorageProvider, UploadParams, UploadResult } from "../types";

function buildPublicUrl(bucket: string, key: string): string {
  const forcePathStyle =
    (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true";
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION ?? "us-east-1";
  // Allow a separate public-facing base URL (useful when the app runs inside
  // Docker and the internal S3_ENDPOINT differs from what browsers can reach).
  const publicBase = process.env.S3_PUBLIC_URL ?? endpoint;

  if (forcePathStyle || endpoint) {
    // MinIO / Cloudflare R2 / path-style: <base>/<bucket>/<key>
    return `${publicBase}/${bucket}/${key}`;
  }

  // AWS S3 virtual-hosted style: https://<bucket>.s3.<region>.amazonaws.com/<key>
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export class S3StorageProvider implements StorageProvider {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION ?? "us-east-1";
    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_KEY;
    const forcePathStyle =
      (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true";

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("S3_ACCESS_KEY and S3_SECRET_KEY must be set.");
    }

    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new Error("S3_BUCKET must be set.");
    }

    this.bucket = bucket;
    this.client = new S3Client({
      region,
      ...(endpoint ? { endpoint } : {}),
      forcePathStyle,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async upload(params: UploadParams): Promise<UploadResult> {
    const { key, body, contentType } = params;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    return { key, url: buildPublicUrl(this.bucket, key) };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key })
    );
  }

  publicUrl(key: string): string {
    return buildPublicUrl(this.bucket, key);
  }

  keyFromUrl(url: string): string | null {
    const forcePathStyle =
      (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true";
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION ?? "us-east-1";
    const publicBase = process.env.S3_PUBLIC_URL ?? endpoint;

    try {
      if (forcePathStyle || endpoint) {
        // path-style: <publicBase>/<bucket>/<key>
        const prefix = `${publicBase}/${this.bucket}/`;
        if (url.startsWith(prefix)) return url.slice(prefix.length);
        return null;
      }
      // virtual-hosted: https://<bucket>.s3.<region>.amazonaws.com/<key>
      const prefix = `https://${this.bucket}.s3.${region}.amazonaws.com/`;
      if (url.startsWith(prefix)) return url.slice(prefix.length);
      return null;
    } catch {
      return null;
    }
  }
}
