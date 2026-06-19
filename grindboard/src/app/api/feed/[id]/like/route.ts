import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const postId = (await params).id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: dbUser.id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { postId, userId: dbUser.id }
      });

      let notification = null;
      // Notify the post author
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (post && post.userId !== dbUser.id) {
        notification = await prisma.notification.create({
          data: {
            userId: post.userId,
            actorId: dbUser.id,
            type: "LIKE",
            referenceId: postId,
          },
          include: { actor: { select: { id: true, name: true, avatarUrl: true, username: true } } }
        });
      }

      return NextResponse.json({ liked: true, notification });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
