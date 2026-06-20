import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/data";

export const metadata: Metadata = {
 title: "Dashboard — Grindboard",
 description: "Your daily study agenda, streak status, and group activity feed",
};

export default async function DashboardPage() {
 const { authUser, dbUser } = await getAuthenticatedUser();

 if (!authUser || !dbUser) {
   redirect("/login");
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

 if (!dashboardUser) redirect("/login");

 const upcomingContests = [nextLC, nextCF].filter(Boolean);

 return <DashboardClient user={dashboardUser} feed={recentActivities} upcomingContests={upcomingContests} />;
}
