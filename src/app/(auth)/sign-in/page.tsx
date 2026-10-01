import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import {
  AuthDivider,
  GoogleSignInButton,
} from "@/components/auth/google-sign-in-button";

export const metadata = { title: "Entrar · makebio" };

export default function SignInPage() {
  return (
    <>
      <div className="grid gap-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight">Entrar</h1>
        <p className="auth-subtitle text-sm">Acesse a sua conta MakeBio.</p>
      </div>

      <GoogleSignInButton />
      <AuthDivider />

      <SignInForm />

      <p className="auth-footer text-center text-sm">
        Não tem conta?{" "}
        <Link href="/sign-up" className="auth-link">
          Criar conta
        </Link>
      </p>
    </>
  );
}
