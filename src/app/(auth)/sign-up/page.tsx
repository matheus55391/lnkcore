import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = { title: "Criar conta · makebio" };

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Comece grátis e publique a sua página em minutos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/sign-in" className="font-medium text-foreground hover:underline">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
