"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await signUp.email({
      name,
      email,
      password,
    });

    if (response.error) {
      setError(response.error.message ?? "Falha no cadastro");
      return;
    }

    await fetch("/api/auth/setup", { method: "POST" });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-2xl font-semibold">Criar conta</h1>
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        data-cy="register-form"
      >
        <input
          data-cy="register-name"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          data-cy="register-email"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          data-cy="register-password"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          data-cy="register-submit"
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-white"
        >
          Criar e entrar
        </button>
      </form>
    </div>
  );
}
