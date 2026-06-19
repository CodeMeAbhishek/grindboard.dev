import type { Metadata } from "next";
import { GoalsClient } from "./GoalsClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Goals — Grindboard",
  description: "Track your active objectives and archived achievements",
};

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  if (!dbUser) redirect("/login");

  const dbGoals = await prisma.goal.findMany({
    where: { userId: dbUser.id },
    include: { module: true },
    orderBy: { deadline: "asc" }
  });

  const activeGoals = dbGoals.filter(g => !g.archived).map(g => ({
    id: g.id,
    title: g.title,
    description: g.description || "",
    module: g.module?.name || "General",
    current: g.currentValue,
    target: g.targetValue,
    deadline: g.deadline,
    archived: false,
    metric: "items"
  }));

  const archivedGoals = dbGoals.filter(g => g.archived).map(g => ({
    id: g.id,
    title: g.title,
    description: g.description || "",
    module: g.module?.name || "General",
    current: g.currentValue,
    target: g.targetValue,
    deadline: g.deadline,
    archived: true,
    metric: "items"
  }));

  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" }
  });

  return (
    <GoalsClient
      initialActiveGoals={activeGoals}
      initialArchivedGoals={archivedGoals}
      modules={modules.map(m => m.name)}
    />
  );
}
