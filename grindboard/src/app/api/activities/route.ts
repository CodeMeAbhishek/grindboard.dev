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
 const { type, moduleId, notes, lcDifficulty, lcProblemName, cfRating, studyHours, metadata } = body;


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
 lcDifficulty: lcDifficulty ?? null,
 lcProblemName: lcProblemName ?? null,
 cfRating: cfRating ? parseInt(cfRating) : null,
 studyHours: studyHours ? parseFloat(studyHours) : null,
 notes: notes ?? null,
 metadata: metadata ?? null,
 },
 });

 // Update user Streak
 await prisma.user.update({
 where: { id: dbUser.id },
 data: { 
 globalStreak: newStreak,
 lastSyncAt: new Date()
 },
 });

 return NextResponse.json({ success: true, activity, newStreak }, { status: 201 });
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
