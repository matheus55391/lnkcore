import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Loader2 } from "lucide-react";

export const metadata = { title: "Redefinir senha · makebio" };

function ResetPasswordFallback() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-[#5c6554]" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="grid gap-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight">Nova senha</h1>
        <p className="auth-subtitle text-sm">
          Defina uma nova senha para sua conta.
        </p>
      </div>

      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>

      <p className="auth-footer text-center text-sm">
        <Link href="/sign-in" className="auth-link">
          Voltar ao login
        </Link>
      </p>
    </>
  );
}
