import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/data";

export async function GET() {
  try {
    const { authUser, dbUser } = await getAuthenticatedUser();

    if (!authUser || !dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();

    const [dashboardUser, recentActivities, nextCF, nextLC] = await Promise.all([
      prisma.user.findUnique({
        where: { id: dbUser.id },
        include: {
          activities: {
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { module: true, user: true },
          },
          streaks: {
            include: { module: true },
          },
          enrollments: {
            include: { module: true },
          }
        },
      }),
      prisma.activity.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true, module: true },
      }),
      prisma.event.findFirst({
        where: { scheduledAt: { gte: now }, type: "CP" },
        orderBy: { scheduledAt: "asc" }
      }),
      prisma.event.findFirst({
        where: { scheduledAt: { gte: now }, type: "LEETCODE" },
        orderBy: { scheduledAt: "asc" }
      })
    ]);

    if (!dashboardUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const upcomingContests = [nextLC, nextCF].filter(Boolean);

    return NextResponse.json({
      user: dashboardUser,
      feed: recentActivities,
      upcomingContests
    });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
