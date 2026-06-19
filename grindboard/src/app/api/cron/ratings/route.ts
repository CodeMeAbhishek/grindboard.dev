import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCFUserInfo } from "@/lib/integrations/codeforces";
import { getLCUserInfo } from "@/lib/integrations/leetcode";

export const maxDuration = 300; // 5 minutes max duration for cron
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { cfHandle: { not: null } },
          { lcHandle: { not: null } }
        ]
      },
      select: {
        id: true,
        cfHandle: true,
        lcHandle: true
      }
    });

    let updated = 0;

    for (const user of users) {
      const updateData: any = {};

      if (user.cfHandle) {
        const cfInfo = await getCFUserInfo(user.cfHandle);
        if (cfInfo) {
          updateData.cfRating = cfInfo.rating;
          updateData.cfMaxRating = cfInfo.maxRating;
          updateData.cfRank = cfInfo.rank;
        }
      }

      if (user.lcHandle) {
        const lcInfo = await getLCUserInfo(user.lcHandle);
        if (lcInfo) {
          updateData.lcRating = lcInfo.rating;
          updateData.lcGlobalRanking = lcInfo.globalRanking;
          updateData.lcTopPercentage = lcInfo.topPercentage;
          updateData.lcBadge = lcInfo.badge;
        }
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData
        });
        updated++;
      }
    }

    return NextResponse.json({ success: true, usersUpdated: updated });

  } catch (error: any) {
    console.error("Cron ratings error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch ratings" }, { status: 500 });
  }
}
