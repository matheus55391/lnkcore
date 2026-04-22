import { z } from "zod";

export const createLinkSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(180).optional().or(z.literal("")),
  url: z.url(),
  imageUrl: z.url().optional().or(z.literal("")),
});

export const updateLinkSchema = createLinkSchema.partial().extend({
  position: z.number().int().min(0).optional(),
});
