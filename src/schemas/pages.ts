import { z } from "zod";

const slug = z
  .string()
  .min(3, "O slug deve ter pelo menos 3 caracteres")
  .max(30, "O slug deve ter no máximo 30 caracteres")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use apenas letras minúsculas, números e hífens (sem começar ou terminar com hífen)"
  );

export const createPageSchema = z.object({
  slug,
});
export type CreatePageInput = z.infer<typeof createPageSchema>;

export const updatePageSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Título obrigatório").max(80),
  bio: z.string().max(280).nullable().optional(),
  image: z.string().url("URL inválida").nullable().optional(),
  published: z.boolean().optional(),
  themeId: z.number().int().min(1).optional(),
});
export type UpdatePageInput = z.infer<typeof updatePageSchema>;

export const deletePageSchema = z.object({
  id: z.string().min(1),
});
export type DeletePageInput = z.infer<typeof deletePageSchema>;
