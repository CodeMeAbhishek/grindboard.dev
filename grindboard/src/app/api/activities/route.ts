import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcLCXP, calcCFXP, XP_VALUES } from "@/lib/gamification";
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
    const { type, moduleId, notes, lcDifficulty, lcProblemName, cfRating, studyHours, metadata } = body;

    // Calculate XP
    let xpEarned = 0;
    if (type === "LEETCODE" && lcDifficulty) {
      xpEarned = calcLCXP(lcDifficulty);
    } else if (type === "CODEFORCES") {
      const rating = parseInt(cfRating ?? "1500");
      const division = rating >= 1600 ? 2 : 3;
      xpEarned = calcCFXP(0, division);
    } else if (type === "STUDY" && studyHours) {
      xpEarned = Math.round(parseFloat(studyHours) * XP_VALUES.STUDY_HOUR);
    } else if (type === "GATE_MOCK") {
      xpEarned = XP_VALUES.GATE_MOCK;
    } else if (type === "TOPIC_COMPLETE") {
      xpEarned = XP_VALUES.TOPIC_COMPLETE;
    } else {
      xpEarned = 10; // default generic XP
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let newStreak = dbUser.globalStreak;
    const lastSync = dbUser.lastSyncAt;
    
    if (lastSync) {
      const last = new Date(lastSync);
      last.setHours(0,0,0,0);
      const diffTime = Math.abs(today.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        userId: dbUser.id,
        moduleId: moduleId ?? null,
        type,
        xpEarned,
        lcDifficulty: lcDifficulty ?? null,
        lcProblemName: lcProblemName ?? null,
        cfRating: cfRating ? parseInt(cfRating) : null,
        studyHours: studyHours ? parseFloat(studyHours) : null,
        notes: notes ?? null,
        metadata: metadata ?? null,
      },
    });

    // Update user XP & Streak
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { 
        xpTotal: { increment: xpEarned },
        globalStreak: newStreak,
        lastSyncAt: new Date()
      },
    });

    return NextResponse.json({ success: true, activity, xpEarned, newStreak }, { status: 201 });
  } catch (error) {
    console.error("POST /api/activities error:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const moduleId = searchParams.get("moduleId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const activities = await prisma.activity.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(moduleId ? { moduleId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { module: true },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
