import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSkillLevel } from "@/lib/gamification";
import { getLCTotalSolved } from "@/lib/integrations/leetcode";
import { getCFTotalSolved } from "@/lib/integrations/codeforces";

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
 select: { type: true, createdAt: true }
 }
 }
 });

 if (!dbUser) redirect("/login");

  const recentActivities = await prisma.activity.findMany({
    where: { userId: dbUser.id, type: { in: ["LEETCODE", "CODEFORCES"] } },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      type: true,
      lcProblemName: true,
      lcDifficulty: true,
      cfContestId: true,
      metadata: true,
      notes: true,
      externalId: true,
      xpEarned: true,
      createdAt: true,
    }
  });

  let lcActualSolved = dbUser.activities.filter(a => a.type === "LEETCODE").length;
  if (dbUser.lcHandle) {
    lcActualSolved = await getLCTotalSolved(dbUser.lcHandle);
  }

  let cfActualSolved = dbUser.activities.filter(a => a.type === "CODEFORCES").length;
  if (dbUser.cfHandle) {
    cfActualSolved = await getCFTotalSolved(dbUser.cfHandle);
  }

  const activityCounts: Record<string, number> = {};
  dbUser.activities.forEach(a => {
    const dateStr = a.createdAt.toISOString().split("T")[0];
    activityCounts[dateStr] = (activityCounts[dateStr] || 0) + 1;
  });

  const userData = {
    name: dbUser.name || "Unknown User",
    username: dbUser.username || "",
    xp: dbUser.xpTotal,
    level: getSkillLevel(dbUser.cfRating, dbUser.lcRating).name,
    streak: dbUser.globalStreak,
    totalSolved: dbUser.activities.length,
    cfSolved: cfActualSolved,
    lcSolved: lcActualSolved,
    cfHandle: dbUser.cfHandle,
    lcHandle: dbUser.lcHandle,
    linkedin: dbUser.linkedin,
    // CP Ratings
    cfRating: dbUser.cfRating,
    cfMaxRating: dbUser.cfMaxRating,
    cfRank: dbUser.cfRank,
    lcRating: dbUser.lcRating,
    lcGlobalRanking: dbUser.lcGlobalRanking,
    lcBadge: dbUser.lcBadge,
    earnedBadges: dbUser.userBadges.map((ub) => ub.badge.key),
    recentActivities: recentActivities.map(a => ({
      ...a,
      metadata: a.metadata as any,
      createdAt: a.createdAt.toISOString()
    })),
    activityCounts
  };

 return <ProfileClient initialUser={userData} />;
}
