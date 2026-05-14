import { redirect } from "next/navigation";
import { getSession } from "@/utils/session";
import { QueryProvider } from "@/providers/query-provider";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return (
    <QueryProvider>
      <div className="min-h-dvh bg-muted/30 flex flex-col">
        <DashboardHeader />
        {children}
      </div>
    </QueryProvider>
  );
}
