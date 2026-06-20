import type { Metadata } from "next";
import { FeedClient } from "./FeedClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Home — Grindboard",
  description: "Community feed",
};

export default async function FeedPage() {
  const { authUser, dbUser } = await getAuthenticatedUser();

  if (!authUser || !dbUser) {
    redirect("/login");
  }

  return <FeedClient currentUserId={dbUser.id} currentUserAvatar={dbUser.avatarUrl} currentUserName={dbUser.name} />;
}
