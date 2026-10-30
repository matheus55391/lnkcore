/** Object key for a processed WebP. Unique per upload so browsers/CDN do not keep a stale avatar.webp. */
export function buildUploadObjectKey(
  userId: string,
  folder: string,
  entityId?: string,
  uniqueId: string = crypto.randomUUID()
): string {
  const name = `${uniqueId}.webp`;
  if (entityId) return `${userId}/${folder}/${entityId}/${name}`;
  return `${userId}/${folder}/${name}`;
}
