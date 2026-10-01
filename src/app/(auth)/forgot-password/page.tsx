import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "Esqueci a senha · makebio" };

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="grid gap-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Esqueci a senha
        </h1>
        <p className="auth-subtitle text-sm">
          Informe seu email para receber um link de recuperação.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="auth-footer text-center text-sm">
        Lembrou a senha?{" "}
        <Link href="/sign-in" className="auth-link">
          Voltar ao login
        </Link>
      </p>
    </>
  );
}
