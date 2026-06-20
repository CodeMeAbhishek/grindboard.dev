import type { Metadata } from "next";
import { SubjectsClient } from "./SubjectsClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
 title: "Subjects — Grindboard",
 description: "Manage your study modules and track streaks",
};

export default async function SubjectsPage() {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
 redirect("/login");
 }

 const dbUser = await prisma.user.findUnique({
 where: { supabaseId: user.id }
 });

 if (!dbUser) redirect("/login");

 const modules = await prisma.module.findMany({
 orderBy: { orderIndex: "asc" },
 include: {
   topics: {
     include: {
       materials: { select: { id: true } }
     }
   }
 }
 });

 const enrollments = await prisma.enrollment.findMany({
 where: { userId: dbUser.id }
 });

 const streaks = await prisma.streak.findMany({
 where: { userId: dbUser.id, moduleId: { not: null } }
 });

 const recentActivities = await prisma.activity.findMany({
 where: { userId: dbUser.id },
 orderBy: { createdAt: "desc" }
 });

 const userMaterials = await prisma.userMaterial.findMany({
   where: { userId: dbUser.id },
   select: { materialId: true }
 });
 const completedMaterialIds = new Set(userMaterials.map(um => um.materialId));

 const subjectsData = modules.map((m) => {
 const enrollment = enrollments.find(e => e.moduleId === m.id);
 const streak = streaks.find(s => s.moduleId === m.id);
 const moduleActivities = recentActivities.filter(a => a.moduleId === m.id);

 let totalMaterials = 0;
 let completedMaterials = 0;
 for (const topic of m.topics) {
   for (const mat of topic.materials) {
     totalMaterials++;
     if (completedMaterialIds.has(mat.id)) {
       completedMaterials++;
     }
   }
 }

 const progressPercentage = totalMaterials === 0 ? 0 : Math.round((completedMaterials / totalMaterials) * 100);

 return {
 id: m.id,
 name: m.name,
 enrolled: !!enrollment,
 streak: streak?.current || 0,
 lastActiveDate: moduleActivities.length > 0 ? moduleActivities[0].createdAt : null,
 progressPercentage,
 totalMaterials,
 completedMaterials
 };
 });

 return <SubjectsClient userId={dbUser.id} initialSubjects={subjectsData} />;
}
