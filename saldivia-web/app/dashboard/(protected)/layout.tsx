import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardFrame } from "./DashboardFrame";

export default async function DashboardProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  return <DashboardFrame email={session.user.email}>{children}</DashboardFrame>;
}
