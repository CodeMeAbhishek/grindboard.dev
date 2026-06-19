import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
 try {
 const supabase = await createClient();
 const { data: { user }, error: authError } = await supabase.auth.getUser();

 if (authError || !user) {
 return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 }

 const body = await req.json();
 const { name, username, selectedPath, cfHandle, lcHandle, linkedin } = body;

 if (!name?.trim()) {
 return NextResponse.json({ error: "Name is required" }, { status: 400 });
 }

 if (!username?.trim()) {
 return NextResponse.json({ error: "Username is required" }, { status: 400 });
 }

 if (!cfHandle?.trim() && !lcHandle?.trim()) {
 return NextResponse.json({ error: "At least one handle is required" }, { status: 400 });
 }

 // Check if username is already taken
 const existingUser = await prisma.user.findUnique({
 where: { username: username.trim() }
 });

 if (existingUser && existingUser.supabaseId !== user.id) {
 return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
 }

 // Update user in the database
 await prisma.user.update({
 where: { supabaseId: user.id },
 data: {
 name: name.trim(),
 username: username.trim(),
 linkedin: linkedin?.trim() || null,
 cfHandle: cfHandle?.trim() || null,
 lcHandle: lcHandle?.trim() || null,
 isOnboarded: true,
 },
 });

 return NextResponse.json({ success: true });
 } catch (error: any) {
 console.error("Onboarding error:", error);
 if (error.code === 'P2002') {
 return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
 }
 return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
 }
}
