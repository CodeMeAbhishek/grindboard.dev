import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCFUpcomingContests } from "@/lib/integrations/codeforces";
import { getLCUpcomingContests } from "@/lib/integrations/leetcode";

export const maxDuration = 300; // 5 minutes max duration for cron
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the system admin user (or any user) to act as "createdBy"
    const admin = await prisma.user.findFirst();
    if (!admin) {
      return NextResponse.json({ error: "No users in DB to own events" }, { status: 400 });
    }

    let inserted = 0;

    // 1. Codeforces Contests
    const cfContests = await getCFUpcomingContests();
    for (const c of cfContests) {
      const extId = `CF_CONTEST_${c.id}`;
      // Check if it exists
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
        inserted++;
      }
    }

    // 2. LeetCode Contests
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
        inserted++;
      }
    }

    return NextResponse.json({ success: true, inserted });

  } catch (error: any) {
    console.error("Cron events error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch events" }, { status: 500 });
  }
}
