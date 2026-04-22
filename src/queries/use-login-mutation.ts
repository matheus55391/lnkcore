import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { loginSchema } from "@/schemas/auth";

export type LoginInput = z.infer<typeof loginSchema>;
export const loginResolver = zodResolver(loginSchema);

export function useLoginMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await signIn.email(data);
      if (response.error) {
        throw new Error(response.error.message ?? "Falha no login");
      }
      await fetch("/api/auth/setup", { method: "POST" });
      return response;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
