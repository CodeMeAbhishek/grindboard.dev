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
    const { topicId, title, url, type, orderIndex } = body;

    const material = await prisma.material.create({
      data: {
        topicId,
        title,
        url,
        type: type || "LINK",
        orderIndex: orderIndex || 0,
      }
    });

    return NextResponse.json({ success: true, material });
  } catch (error) {
    console.error("Failed to create material:", error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.material.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete material:", error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
