import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { registerSchema } from "@/schemas/auth";

export type RegisterInput = z.infer<typeof registerSchema>;
export const registerResolver = zodResolver(registerSchema);

export function useRegisterMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await signUp.email(data);
      if (response.error) {
        throw new Error(response.error.message ?? "Falha no cadastro");
      }
      await fetch("/api/auth/setup", { method: "POST" });
      return response;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}
