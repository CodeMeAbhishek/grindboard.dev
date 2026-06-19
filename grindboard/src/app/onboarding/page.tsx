import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
 redirect("/login");
 }

 const dbUser = await prisma.user.findUnique({
 where: { supabaseId: user.id },
 });

 if (!dbUser) {
 redirect("/login");
 }

 if (dbUser.isOnboarded) {
 redirect("/dashboard");
 }

 return (
 <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-4 transition-colors">
 <div className="w-full max-w-2xl">
 <OnboardingWizard initialName={dbUser.name} />
 </div>
 </div>
 );
}
