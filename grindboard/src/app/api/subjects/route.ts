import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/data";

export async function GET() {
  try {
    const { authUser, dbUser } = await getAuthenticatedUser();

    if (!authUser || !dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [modules, enrollments, streaks, recentActivities, userMaterials] = await Promise.all([
      prisma.module.findMany({
        orderBy: { orderIndex: "asc" },
        include: {
          topics: {
            include: {
              materials: { select: { id: true } }
            }
          }
        }
      }),
      prisma.enrollment.findMany({
        where: { userId: dbUser.id }
      }),
      prisma.streak.findMany({
        where: { userId: dbUser.id, moduleId: { not: null } }
      }),
      prisma.activity.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" }
      }),
      prisma.userMaterial.findMany({
        where: { userId: dbUser.id },
        select: { materialId: true }
      })
    ]);

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

    return NextResponse.json(subjectsData);
  } catch (error) {
    console.error("[SUBJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
