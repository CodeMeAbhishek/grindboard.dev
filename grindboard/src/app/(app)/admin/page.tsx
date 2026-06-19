import type { Metadata } from "next";
import { AdminClient } from "./AdminClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel — Grindboard",
  description: "System overview, user management, and broadcast announcements",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const dbUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  const adminUsers = dbUsers.map((u) => ({
    id: u.id,
    name: u.name || "Unknown",
    xp: u.xpTotal,
    isAdmin: u.role === "ADMIN",
    initials: (u.name || "U").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
  }));

  const modules = await prisma.module.findMany({
    include: {
      topics: true,
      enrollments: true
    }
  });

  const adminModules = modules.map((m) => ({
    id: m.id,
    name: m.name,
    topics: m.topics.length,
    enrolled: m.enrollments.length,
    color: m.color || "bg-primary"
  }));

  const activeUsers = dbUsers.length;
  const totalXP = dbUsers.reduce((sum, u) => sum + u.xpTotal, 0);
  const avgXp = activeUsers > 0 ? Math.round(totalXP / activeUsers) : 0;
  
  const stats = {
    activeUsers,
    avgXp
  };

  return <AdminClient initialUsers={adminUsers} initialModules={adminModules} stats={stats} />;
}
