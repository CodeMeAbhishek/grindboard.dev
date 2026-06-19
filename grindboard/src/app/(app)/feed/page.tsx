import type { Metadata } from "next";
import { FeedClient } from "./FeedClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home — Grindboard",
  description: "Community feed",
};

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  if (!dbUser) redirect("/login");

  return <FeedClient currentUserId={dbUser.id} currentUserAvatar={dbUser.avatarUrl} currentUserName={dbUser.name} />;
}
