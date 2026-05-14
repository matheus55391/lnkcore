import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import type { StorageProvider, UploadParams, UploadResult } from "../types";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function buildPublicUrl(bucket: string, key: string): string {
  const forcePathStyle =
    (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true";
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION ?? "us-east-1";
  const publicBase = process.env.S3_PUBLIC_URL;

  // When S3_PUBLIC_URL is configured (e.g. R2 custom domain or r2.dev),
  // it is expected to point directly to object root: <publicBase>/<key>.
  if (publicBase) {
    return `${trimTrailingSlash(publicBase)}/${key}`;
  }

  if (endpoint && (forcePathStyle || endpoint)) {
    // MinIO / Cloudflare R2 / path-style: <base>/<bucket>/<key>
    return `${trimTrailingSlash(endpoint)}/${bucket}/${key}`;
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

  async objectExists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key })
      );
      return true;
    } catch {
      return false;
    }
  }

  async countByPrefix(prefix: string): Promise<number> {
    let total = 0;
    let continuationToken: string | undefined;

    do {
      const response = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        })
      );

      total += response.Contents?.length ?? 0;
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);

    return total;
  }

  publicUrl(key: string): string {
    return buildPublicUrl(this.bucket, key);
  }

  keyFromUrl(url: string): string | null {
    const forcePathStyle =
      (process.env.S3_FORCE_PATH_STYLE ?? "true") === "true";
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION ?? "us-east-1";
    const publicBase = process.env.S3_PUBLIC_URL;

    try {
      if (publicBase) {
        // publicBase style: <publicBase>/<key>
        const prefix = `${trimTrailingSlash(publicBase)}/`;
        if (url.startsWith(prefix)) return url.slice(prefix.length);
        return null;
      }
      if (endpoint && (forcePathStyle || endpoint)) {
        // path-style: <endpoint>/<bucket>/<key>
        const prefix = `${trimTrailingSlash(endpoint)}/${this.bucket}/`;
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
