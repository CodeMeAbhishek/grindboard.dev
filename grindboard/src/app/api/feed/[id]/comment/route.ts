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
    const body = await req.json();
    const { content, parentId } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        userId: dbUser.id,
        parentId: parentId || null
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, username: true } }
      }
    });

    let notification = null;

    // Create notification
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment && parentComment.userId !== dbUser.id) {
        notification = await prisma.notification.create({
          data: {
            userId: parentComment.userId,
            actorId: dbUser.id,
            type: "REPLY_ON_COMMENT",
            referenceId: parentId,
          },
          include: { actor: { select: { id: true, name: true, avatarUrl: true, username: true } } }
        });
      }
    } else {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (post && post.userId !== dbUser.id) {
        notification = await prisma.notification.create({
          data: {
            userId: post.userId,
            actorId: dbUser.id,
            type: "COMMENT_ON_POST",
            referenceId: postId,
          },
          include: { actor: { select: { id: true, name: true, avatarUrl: true, username: true } } }
        });
      }
    }

    return NextResponse.json({ comment, notification });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    if (comment.userId !== dbUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
