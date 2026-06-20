import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedClient } from "./FeedClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/data";
import { FeedSkeleton } from "@/components/skeletons";

export const metadata: Metadata = {
  title: "Home — Grindboard",
  description: "Community feed",
};

export default function FeedPage() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <FeedContent />
    </Suspense>
  );
}

async function FeedContent() {
  const { authUser, dbUser } = await getAuthenticatedUser();

  if (!authUser || !dbUser) {
    redirect("/login");
  }

  return <FeedClient currentUserId={dbUser.id} currentUserAvatar={dbUser.avatarUrl} currentUserName={dbUser.name} />;
}
