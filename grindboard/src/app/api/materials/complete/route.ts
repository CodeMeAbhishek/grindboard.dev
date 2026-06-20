import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { materialId, completed } = body;

    if (completed) {
      await prisma.userMaterial.upsert({
        where: {
          userId_materialId: {
            userId: dbUser.id,
            materialId,
          }
        },
        update: {},
        create: {
          userId: dbUser.id,
          materialId,
        }
      });

      const material = await prisma.material.findUnique({
        where: { id: materialId },
        include: { topic: true }
      });

      if (material) {
        const moduleId = material.topic.moduleId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Update Global Streak
        let newGlobalStreak = dbUser.globalStreak;
        const lastSync = dbUser.lastSyncAt;

        if (lastSync) {
          const last = new Date(lastSync);
          last.setHours(0, 0, 0, 0);
          const diffTime = Math.abs(today.getTime() - last.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newGlobalStreak += 1;
          } else if (diffDays > 1) {
            newGlobalStreak = 1;
          }
        } else {
          newGlobalStreak = 1;
        }

        await prisma.user.update({
          where: { id: dbUser.id },
          data: { 
            globalStreak: newGlobalStreak,
            lastSyncAt: new Date()
          }
        });

        // 2. Update Module Streak
        const moduleStreak = await prisma.streak.findUnique({
          where: { userId_moduleId: { userId: dbUser.id, moduleId } }
        });

        let newModuleStreak = moduleStreak?.current || 0;
        let newLongest = moduleStreak?.longest || 0;
        const lastModuleSync = moduleStreak?.lastActivityDate;

        if (lastModuleSync) {
          const last = new Date(lastModuleSync);
          last.setHours(0, 0, 0, 0);
          const diffTime = Math.abs(today.getTime() - last.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newModuleStreak += 1;
          } else if (diffDays > 1) {
            newModuleStreak = 1;
          }
        } else {
          newModuleStreak = 1;
        }

        if (newModuleStreak > newLongest) {
          newLongest = newModuleStreak;
        }

        await prisma.streak.upsert({
          where: { userId_moduleId: { userId: dbUser.id, moduleId } },
          update: {
            current: newModuleStreak,
            longest: newLongest,
            lastActivityDate: new Date()
          },
          create: {
            userId: dbUser.id,
            moduleId,
            current: newModuleStreak,
            longest: newLongest,
            lastActivityDate: new Date()
          }
        });

        // 3. Create Activity
        await prisma.activity.create({
          data: {
            userId: dbUser.id,
            moduleId,
            type: "TOPIC_COMPLETE",
            notes: `Completed: ${material.title}`,
            externalId: materialId
          }
        });
      }
    } else {
      await prisma.userMaterial.deleteMany({
        where: {
          userId: dbUser.id,
          materialId,
        }
      });
      
      // Remove the corresponding activity
      await prisma.activity.deleteMany({
        where: {
          userId: dbUser.id,
          type: "TOPIC_COMPLETE",
          externalId: materialId
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to toggle material completion:", error);
    return NextResponse.json({ error: "Failed to toggle completion" }, { status: 500 });
  }
}
