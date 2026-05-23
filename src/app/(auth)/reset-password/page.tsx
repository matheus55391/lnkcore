import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Loader2 } from "lucide-react";

export const metadata = { title: "Redefinir senha · makebio" };

function ResetPasswordFallback() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Nova senha</CardTitle>
        <CardDescription>Defina uma nova senha para sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Suspense fallback={<ResetPasswordFallback />}>
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/sign-in"
            className="font-medium text-foreground hover:underline"
          >
            Voltar ao login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
