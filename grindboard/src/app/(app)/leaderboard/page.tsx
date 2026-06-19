import type { Metadata } from "next";
import { LeaderboardClient } from "./LeaderboardClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Leaderboard — Grindboard",
  description: "Global group rankings by XP, streaks, and problems solved",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  if (!dbUser) redirect("/login");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      xpTotal: true,
      globalStreak: true,
      activities: {
        where: { type: "LEETCODE" },
        select: { id: true }
      }
    }
  });

  const leaderboardData = users.map((u) => ({
    id: u.id,
    name: u.name || "Unknown User",
    xp: u.xpTotal,
    streak: u.globalStreak,
    problems: u.activities.length,
    isCurrentUser: u.id === dbUser.id
  }));

  return <LeaderboardClient initialData={leaderboardData} />;
}
