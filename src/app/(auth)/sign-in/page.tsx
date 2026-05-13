import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = { title: "Entrar · lnkcore" };

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse a sua conta lnkcore.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInForm />
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/sign-up" className="font-medium text-foreground hover:underline">
            Criar conta
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
