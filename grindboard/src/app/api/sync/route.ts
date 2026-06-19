import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { syncUserProgress } from "@/lib/integrations/sync";

export async function POST(request: Request) {
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
 return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
 }

 if (!dbUser.lcHandle && !dbUser.cfHandle) {
 return NextResponse.json({ error: "No handles configured. Please set your LeetCode or Codeforces handle in your profile." }, { status: 400 });
 }

 const result = await syncUserProgress(dbUser.id);
 
 return NextResponse.json({ success: true, ...result });

 } catch (error: any) {
 console.error("Sync error:", error);
 return NextResponse.json({ error: error.message || "Failed to sync" }, { status: 500 });
 }
}
