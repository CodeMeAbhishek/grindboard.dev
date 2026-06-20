import type { Metadata } from "next";
import { AdminClient } from "./AdminClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

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
 cfRating: u.cfRating,
 lcRating: u.lcRating,
 isAdmin: u.role === "ADMIN",
 initials: (u.name || "U").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
 }));

  const modules = await prisma.module.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      topics: {
        orderBy: { orderIndex: "asc" },
        include: {
          materials: {
            orderBy: { orderIndex: "asc" }
          }
        }
      },
      enrollments: true
    }
  });

  const adminModules = modules.map((m) => ({
    id: m.id,
    name: m.name,
    topics: m.topics,
    enrolled: m.enrollments.length,
    color: m.color || "bg-primary"
  }));

 const activeUsers = dbUsers.length;
 const stats = {
 activeUsers
 };

 return <AdminClient initialUsers={adminUsers} initialModules={adminModules} stats={stats} />;
}
