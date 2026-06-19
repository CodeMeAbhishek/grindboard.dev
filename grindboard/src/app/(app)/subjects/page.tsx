import type { Metadata } from "next";
import { SubjectsClient } from "./SubjectsClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Subjects — Grindboard",
  description: "Manage your study modules, track streaks and weekly XP goals",
};

export default async function SubjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  if (!dbUser) redirect("/login");

  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" }
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: dbUser.id }
  });

  const streaks = await prisma.streak.findMany({
    where: { userId: dbUser.id, moduleId: { not: null } }
  });

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const recentActivities = await prisma.activity.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" }
  });

  const subjectsData = modules.map((m) => {
    const enrollment = enrollments.find(e => e.moduleId === m.id);
    const streak = streaks.find(s => s.moduleId === m.id);
    const moduleActivities = recentActivities.filter(a => a.moduleId === m.id);
    
    const weeklyActivities = moduleActivities.filter(a => a.createdAt >= startOfWeek);
    const weeklyXP = weeklyActivities.reduce((sum, a) => sum + a.xpEarned, 0);

    return {
      id: m.id,
      name: m.name,
      enrolled: !!enrollment,
      streak: streak?.current || 0,
      weeklyXP: weeklyXP,
      weeklyGoal: enrollment?.weeklyXpGoal || 500,
      lastActiveDate: moduleActivities.length > 0 ? moduleActivities[0].createdAt : null,
    };
  });

  return <SubjectsClient userId={dbUser.id} initialSubjects={subjectsData} />;
}
