import type { Metadata } from "next";
import ContestsClient from "./ContestsClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCFUpcomingContests } from "@/lib/integrations/codeforces";
import { getLCUpcomingContests } from "@/lib/integrations/leetcode";

export const metadata: Metadata = {
  title: "Contests — Grindboard",
  description: "Upcoming and past competitive programming contests",
};

export default async function ContestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  if (!dbUser) redirect("/login");

  const now = new Date();
  
  let dbUpcoming = await prisma.event.findMany({
    where: { scheduledAt: { gte: now } },
    orderBy: { scheduledAt: "asc" }
  });

  // If DB has no upcoming events (e.g. cron hasn't run), fetch from APIs
  if (dbUpcoming.length === 0) {
    try {
      const admin = await prisma.user.findFirst();
      if (admin) {
        // CF
        const cfContests = await getCFUpcomingContests();
        for (const c of cfContests) {
          const extId = `CF_CONTEST_${c.id}`;
          const existing = await prisma.event.findFirst({ where: { platformUrl: extId } });
          if (!existing) {
            await prisma.event.create({
              data: {
                title: c.name,
                type: "CP",
                platformUrl: extId,
                scheduledAt: new Date(c.startTimeSeconds * 1000),
                createdBy: admin.id,
                description: `Codeforces ${c.phase} contest - Duration: ${c.durationSeconds / 3600} hours`
              }
            });
          }
        }
        
        // LC
        const lcContests = await getLCUpcomingContests();
        for (const c of lcContests) {
          const extId = `LC_CONTEST_${c.titleSlug}`;
          const existing = await prisma.event.findFirst({ where: { platformUrl: extId } });
          if (!existing) {
            await prisma.event.create({
              data: {
                title: c.title,
                type: "LEETCODE",
                platformUrl: extId,
                scheduledAt: new Date(c.startTime * 1000),
                createdBy: admin.id,
                description: `LeetCode upcoming contest. Duration: ${c.duration / 60} minutes`
              }
            });
          }
        }

        // Refetch after inserting
        dbUpcoming = await prisma.event.findMany({
          where: { scheduledAt: { gte: now } },
          orderBy: { scheduledAt: "asc" }
        });
      }
    } catch (e) {
      console.error("Auto sync contests error:", e);
    }
  }

  const upcoming = dbUpcoming.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    time: e.scheduledAt.toISOString(),
    description: e.description || "",
    url: e.platformUrl || "#"
  }));

  const dbPast = await prisma.event.findMany({
    where: { scheduledAt: { lt: now } },
    orderBy: { scheduledAt: "desc" },
    take: 50 // Limit to last 50 past contests
  });

  const past = dbPast.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    time: e.scheduledAt.toISOString(),
    description: e.description || "",
    url: e.platformUrl || "#"
  }));

  return <ContestsClient upcoming={upcoming} past={past} />;
}
