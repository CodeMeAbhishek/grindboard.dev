import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { authUser, dbUser } = await getAuthenticatedUser();

    if (!authUser || !dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    const [activities, totalCount] = await Promise.all([
      prisma.activity.findMany({
        where: { userId: dbUser.id, type: { in: ["LEETCODE", "CODEFORCES"] } },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.activity.count({
        where: { userId: dbUser.id, type: { in: ["LEETCODE", "CODEFORCES"] } }
      })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      activities,
      totalCount,
      totalPages,
      page
    });
  } catch (error) {
    console.error("GET /api/history error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
