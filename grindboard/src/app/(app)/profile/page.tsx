import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
   redirect("/login");
 }

 const dbUser = await prisma.user.findUnique({
   where: { supabaseId: user.id }
 });

 if (!dbUser) {
   redirect("/login");
 }

 redirect(`/u/${dbUser.username || dbUser.id}`);
}
