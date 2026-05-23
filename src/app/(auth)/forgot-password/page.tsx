import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "Esqueci a senha · makebio" };

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Esqueci a senha</CardTitle>
        <CardDescription>
          Informe seu email para receber um link de recuperação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ForgotPasswordForm />
        <p className="text-center text-sm text-muted-foreground">
          Lembrou a senha?{" "}
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
