import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
 try {
 const users = await prisma.user.findMany({
 select: {
 id: true,
 name: true,
 avatarUrl: true,
 xpTotal: true,
 globalStreak: true,
 role: true,
 createdAt: true,
 _count: {
 select: { activities: true },
 },
 },
 orderBy: { xpTotal: "desc" },
 take: 50,
 });

 return NextResponse.json(users);
 } catch (error) {
 console.error("GET /api/leaderboard error:", error);
 return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
 }
}
