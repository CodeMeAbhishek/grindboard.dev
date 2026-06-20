import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authUser, dbUser } = await getAuthenticatedUser();

    if (!authUser || !dbUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const module = await prisma.module.findUnique({
      where: { id: id },
      include: {
        topics: {
          orderBy: { orderIndex: "asc" },
          include: {
            materials: {
              orderBy: { orderIndex: "asc" }
            }
          }
        },
      }
    });

    if (!module) {
      return new NextResponse("Not Found", { status: 404 });
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

    const materialIds = module.topics.flatMap(t => t.materials.map(m => m.id));
    const userMaterials = await prisma.userMaterial.findMany({
      where: { userId: dbUser.id, materialId: { in: materialIds } }
    });

    const activities = await prisma.activity.findMany({
      where: { userId: dbUser.id, moduleId: module.id },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const subjectData = {
      id: module.id,
      name: module.name,
      description: module.description || "",
      icon: module.icon,
      streak: streak?.current || 0,
      enrolledUsers: enrolledCount,
      isEnrolled: !!enrollment,
      topics: module.topics.map((t) => {
        const materials = t.materials.map((m) => ({
          id: m.id,
          title: m.title,
          url: m.url,
          type: m.type,
          completed: userMaterials.some((um) => um.materialId === m.id),
          metadata: m.metadata || null
        }));
        return {
          id: t.id,
          name: t.name,
          completed: userTopics.some((ut) => ut.topicId === t.id),
          materials
        };
      }),
      activities: activities.map((a) => ({
        id: a.id,
        type: a.type,
        label: a.notes || a.lcProblemName || `Activity ${a.type}`,
        createdAt: a.createdAt
      }))
    };

    return NextResponse.json(subjectData);
  } catch (error) {
    console.error("GET /api/subjects/[id] error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
