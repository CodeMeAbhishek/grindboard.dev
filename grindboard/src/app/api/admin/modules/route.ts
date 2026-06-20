import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser || dbUser.role !== "ADMIN") return null;
  return dbUser;
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, description, icon, color } = body;

    const module = await prisma.module.create({
      data: {
        name,
        description,
        icon: icon || "book",
        color: color || "#10B981",
      }
    });

    return NextResponse.json({ success: true, module });
  } catch (error) {
    console.error("Failed to create module:", error);
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 });
  }
}
