import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicProfileClient from "./PublicProfileClient";

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      activities: {
        orderBy: { date: 'desc' },
        take: 10
      },
      goals: {
        where: { isCompleted: false },
        orderBy: { createdAt: 'desc' },
        take: 5
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

  return <PublicProfileClient user={user} />;
}
