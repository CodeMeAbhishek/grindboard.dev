import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUserProgress } from "@/lib/integrations/sync";

export const maxDuration = 300; // 5 minutes max duration for cron
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check for auth header if using vercel cron
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all users who have either LC or CF handles
    const usersToSync = await prisma.user.findMany({
      where: {
        OR: [
          { lcHandle: { not: null } },
          { cfHandle: { not: null } }
        ]
      },
      select: { id: true }
    });

    let totalNewActivities = 0;
    let totalXPGained = 0;
    let syncedUsers = 0;

    for (const user of usersToSync) {
      try {
        const result = await syncUserProgress(user.id);
        totalNewActivities += result.newActivities;
        totalXPGained += result.xpGained;
        syncedUsers++;
      } catch (err) {
        console.error(`Failed to sync user ${user.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      syncedUsers,
      totalNewActivities,
      totalXPGained
    });

  } catch (error: any) {
    console.error("Cron sync error:", error);
    return NextResponse.json({ error: error.message || "Failed to sync" }, { status: 500 });
  }
}
