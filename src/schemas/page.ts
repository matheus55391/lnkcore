import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const updatePageSchema = z.object({
  slug: z.string().regex(slugRegex).min(3).max(50),
  title: z.string().min(2).max(80),
  description: z.string().max(240).optional().or(z.literal("")),
  avatarUrl: z.url().optional().or(z.literal("")),
});
