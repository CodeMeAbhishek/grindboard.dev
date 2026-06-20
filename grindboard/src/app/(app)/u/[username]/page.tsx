import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import PublicProfileClient from "./PublicProfileClient";

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(username);

  const user = await prisma.user.findFirst({
    where: isUuid ? { id: username } : { username },
    include: {
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      userBadges: {
        include: {
          badge: true
        }
      }
    }
  });

  if (!user) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const isCurrentUser = authUser?.id === user.supabaseId;

  return <PublicProfileClient user={user} isCurrentUser={isCurrentUser} />;
}
