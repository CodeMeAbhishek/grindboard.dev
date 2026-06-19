import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLevel } from "@/lib/gamification";

export const metadata: Metadata = {
  title: "Profile — Grindboard",
  description: "Your stats, linked accounts, badges, and activity heatmap",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      userBadges: {
        include: { badge: true }
      },
      activities: {
        where: { type: { in: ["LEETCODE", "CODEFORCES"] } },
        select: { id: true }
      }
    }
  });

  if (!dbUser) redirect("/login");

  const userData = {
    name: dbUser.name || "Unknown User",
    xp: dbUser.xpTotal,
    level: getLevel(dbUser.xpTotal).name,
    streak: dbUser.globalStreak,
    totalSolved: dbUser.activities.length,
    cfHandle: dbUser.cfHandle,
    lcHandle: dbUser.lcHandle,
    earnedBadges: dbUser.userBadges.map((ub) => ub.badge.key),
  };

  return <ProfileClient initialUser={userData} />;
}
