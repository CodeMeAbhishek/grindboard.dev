import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard — Grindboard",
  description: "Your daily study agenda, streak status, and group activity feed",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      activities: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { module: true },
      },
      goals: {
        where: { archived: false },
        include: { module: true },
      },
      streaks: {
        include: { module: true },
      }
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const recentActivities = await prisma.activity.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, module: true },
  });

  return <DashboardClient user={dbUser} feed={recentActivities} />;
}
