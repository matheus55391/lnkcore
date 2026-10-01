import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  AuthDivider,
  GoogleSignInButton,
} from "@/components/auth/google-sign-in-button";

export const metadata = { title: "Criar conta · makebio" };

export default function SignUpPage() {
  return (
    <>
      <div className="grid gap-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight">Criar conta</h1>
        <p className="auth-subtitle text-sm">
          Comece grátis e publique a sua página em minutos.
        </p>
      </div>

      <GoogleSignInButton label="Continuar com Google" />
      <AuthDivider label="ou com e-mail" />

      <SignUpForm />

      <p className="auth-footer text-center text-sm">
        Já tem conta?{" "}
        <Link href="/sign-in" className="auth-link">
          Entrar
        </Link>
      </p>
    </>
  );
}
