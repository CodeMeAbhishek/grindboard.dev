import type { Metadata } from "next";
import { SubjectDetailClient } from "./SubjectDetailClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
 title: "Subject Detail — Grindboard",
 description: "Topics, progress, recent activity, and stats for a module",
};

export default async function SubjectDetailPage({ params }: { params: { id: string } }) {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
 redirect("/login");
 }

 const dbUser = await prisma.user.findUnique({
 where: { supabaseId: user.id }
 });

 if (!dbUser) redirect("/login");

 const module = await prisma.module.findUnique({
 where: { id: params.id },
 include: {
 topics: {
 orderBy: { orderIndex: "asc" }
 },
 }
 });

 if (!module) {
 redirect("/subjects");
 }

 const enrollment = await prisma.enrollment.findUnique({
 where: { userId_moduleId: { userId: dbUser.id, moduleId: module.id } }
 });

 const streak = await prisma.streak.findUnique({
 where: { userId_moduleId: { userId: dbUser.id, moduleId: module.id } }
 });

 const enrolledCount = await prisma.enrollment.count({
 where: { moduleId: module.id }
 });

 const userTopics = await prisma.userTopic.findMany({
 where: { userId: dbUser.id, topicId: { in: module.topics.map((t) => t.id) } }
 });

 const activities = await prisma.activity.findMany({
 where: { userId: dbUser.id, moduleId: module.id },
 orderBy: { createdAt: "desc" },
 take: 10
 });

 const startOfWeek = new Date();
 startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
 startOfWeek.setHours(0, 0, 0, 0);

 const weeklyActivities = activities.filter((a) => a.createdAt >= startOfWeek);
 const weeklyXP = weeklyActivities.reduce((sum, a) => sum + a.xpEarned, 0);
 const totalXP = activities.reduce((sum, a) => sum + a.xpEarned, 0);

 const subjectData = {
 id: module.id,
 name: module.name,
 description: module.description || "",
 icon: module.icon,
 streak: streak?.current || 0,
 totalXP: totalXP,
 weeklyXP: weeklyXP,
 weeklyGoal: enrollment?.weeklyXpGoal || 500,
 enrolledUsers: enrolledCount,
 topics: module.topics.map((t) => ({
 id: t.id,
 name: t.name,
 completed: userTopics.some((ut) => ut.topicId === t.id),
 xp: 100
 })),
 activities: activities.map((a) => ({
 id: a.id,
 type: a.type,
 label: a.notes || a.lcProblemName || `Activity ${a.type}`,
 xp: a.xpEarned,
 createdAt: a.createdAt
 }))
 };

 return <SubjectDetailClient subject={subjectData as any} />;
}
