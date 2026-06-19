import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSkillLevel } from "@/lib/gamification";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
 redirect("/login");
 }

 const dbUser = await prisma.user.findUnique({
 where: { supabaseId: user.id },
 });

 if (dbUser && !dbUser.isOnboarded) {
 redirect("/onboarding");
 }

 const userLevel = dbUser ? getSkillLevel(dbUser.cfRating, dbUser.lcRating).name : "Unranked";

 return (
 <div className="min-h-screen bg-background flex">
 {/* Desktop Sidebar */}
 <Sidebar 
    userRole={dbUser?.role || "MEMBER"} 
    userName={dbUser?.name || undefined} 
    userLevel={userLevel} 
  />

 {/* Desktop + Mobile Header */}
 <Header userId={dbUser?.id || undefined} userName={dbUser?.name || undefined} userAvatarUrl={dbUser?.avatarUrl || undefined} />

 {/* Main Content */}
 <main className="flex-1 md:ml-64 pt-14 md:pt-16 min-h-screen pb-20 md:pb-0">
 <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
 {children}
 </div>
 </main>

 {/* Mobile Bottom Nav */}
 <MobileNav />
 </div>
 );
}
