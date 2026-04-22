import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(64),
  name: z.string().min(2).max(80),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(64),
});
