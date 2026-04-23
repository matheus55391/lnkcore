import { redirect } from "next/navigation";
import { getSession } from "@/utils/session";
import { QueryProvider } from "@/lib/query-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return <QueryProvider>{children}</QueryProvider>;
}
