import { z } from "zod";

export const createLinkSchema = z.object({
  pageId: z.string().min(1),
  title: z.string().min(1, "Título obrigatório").max(80),
  url: z.string().url("URL inválida"),
  image: z.string().url().nullable().optional(),
});
export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export const updateLinkSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Título obrigatório").max(80),
  url: z.string().url("URL inválida"),
  image: z.string().url().nullable().optional(),
  active: z.boolean().optional(),
  position: z.number().int().nonnegative().optional(),
});
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export const deleteLinkSchema = z.object({
  id: z.string().min(1),
});
export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;
