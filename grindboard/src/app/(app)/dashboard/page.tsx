import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
 title: "Dashboard — Grindboard",
 description: "Your daily study agenda, streak status, and group activity feed",
};

export default async function DashboardPage() {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
 redirect("/login");
 }

 let dbUser = await prisma.user.findUnique({
 where: { supabaseId: user.id },
 include: {
 activities: {
 take: 10,
 orderBy: { createdAt: "desc" },
 include: { module: true, user: true },
 },
 goals: {
 where: { archived: false },
 include: { module: true },
 },
 streaks: {
 include: { module: true },
 },
 enrollments: {
 include: { module: true },
 }
 },
 });

 if (!dbUser) {
 // Fallback: If user authenticated via OTP/OAuth but the DB record doesn't exist yet, create it.
 await prisma.user.create({
 data: {
 supabaseId: user.id,
 email: user.email!,
 name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
 avatarUrl: user.user_metadata?.avatar_url || null,
 }
 });

 // Re-fetch the newly created user with all the relationships
 dbUser = await prisma.user.findUnique({
 where: { supabaseId: user.id },
 include: {
 activities: {
 take: 10,
 orderBy: { createdAt: "desc" },
 include: { module: true, user: true },
 },
 goals: {
 where: { archived: false },
 include: { module: true },
 },
 streaks: {
 include: { module: true },
 },
 enrollments: {
 include: { module: true },
 }
 },
 });

 // If it still fails, then something is very wrong, push back to login
 if (!dbUser) {
 redirect("/login");
 }
 }

  const recentActivities = await prisma.activity.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, module: true },
  });

  const now = new Date();
  const nextCF = await prisma.event.findFirst({
    where: { scheduledAt: { gte: now }, type: "CP" },
    orderBy: { scheduledAt: "asc" }
  });

  const nextLC = await prisma.event.findFirst({
    where: { scheduledAt: { gte: now }, type: "LEETCODE" },
    orderBy: { scheduledAt: "asc" }
  });

  const upcomingContests = [nextLC, nextCF].filter(Boolean);

  return <DashboardClient user={dbUser} feed={recentActivities} upcomingContests={upcomingContests} />;
}
