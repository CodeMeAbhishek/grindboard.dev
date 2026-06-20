import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/data";

export async function GET() {
  try {
    const { authUser, dbUser } = await getAuthenticatedUser();

    if (!authUser || !dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        cfHandle: true,
        lcHandle: true,
        cfRating: true,
        cfRank: true,
        lcRating: true,
        lcGlobalRanking: true,
        lcBadge: true,
      }
    });

    const leaderboardData = users.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name || "Unknown User",
      avatarUrl: u.avatarUrl,
      cfHandle: u.cfHandle,
      lcHandle: u.lcHandle,
      cfRating: u.cfRating || 0,
      cfRank: u.cfRank,
      lcRating: u.lcRating ? Math.round(u.lcRating) : 0,
      lcGlobalRanking: u.lcGlobalRanking,
      lcBadge: u.lcBadge,
      isCurrentUser: u.id === dbUser.id
    }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("GET /api/leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
