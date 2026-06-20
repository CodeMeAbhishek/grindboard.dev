import type { Metadata } from "next";
import { LeaderboardClient } from "./LeaderboardClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/data";

export const metadata: Metadata = {
 title: "Leaderboard — Grindboard",
 description: "Global group rankings by rating, streaks, and problems solved",
};

export default async function LeaderboardPage() {
 const { authUser, dbUser } = await getAuthenticatedUser();

 if (!authUser || !dbUser) {
   redirect("/login");
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

 return <LeaderboardClient initialData={leaderboardData} />;
}
