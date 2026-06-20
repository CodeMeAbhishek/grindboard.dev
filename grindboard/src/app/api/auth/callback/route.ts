import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
 const requestUrl = new URL(request.url);
 const code = requestUrl.searchParams.get("code");

 if (code) {
 const supabase = await createClient();
 const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
 
 if (!error && authData.user) {
 // Sync user to our database
 const user = authData.user;
 
 try {
 const dbUser = await prisma.user.upsert({
 where: { supabaseId: user.id },
 update: {
 email: user.email!,
 name: user.user_metadata.full_name || user.email?.split("@")[0] || "User",
 avatarUrl: user.user_metadata.avatar_url || null,
 },
 create: {
 supabaseId: user.id,
 email: user.email!,
 name: user.user_metadata.full_name || user.email?.split("@")[0] || "User",
 avatarUrl: user.user_metadata.avatar_url || null,
 },
 });

 // URL to redirect to after sign in process completes
 if (!dbUser.isOnboarded) {
 return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
 }
 } catch (err) {
 console.error("Error syncing user to DB:", err);
 }
 }
 }

 return NextResponse.redirect(`${requestUrl.origin}/feed`);
}
