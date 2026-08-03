/** Client-side helper for POST /api/upload (S3-compatible storage). */
export async function uploadImageFile(
  file: File,
  folder: string,
  entityId: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);
  formData.append("entityId", entityId);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as {
    url?: string;
    error?: string;
  };

  if (!res.ok || !data.url) {
    throw new Error(data.error ?? "Falha no upload.");
  }

  return data.url;
}
