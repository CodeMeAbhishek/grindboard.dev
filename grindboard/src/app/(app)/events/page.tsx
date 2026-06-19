import type { Metadata } from "next";
import { EventsClient } from "./EventsClient";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Events — Grindboard",
  description: "Upcoming contests and past event results with group leaderboard",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });

  if (!dbUser) redirect("/login");

  const now = new Date();
  
  const dbUpcoming = await prisma.event.findMany({
    where: { date: { gte: now } },
    orderBy: { date: "asc" }
  });

  const upcoming = dbUpcoming.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    platform: e.platform || "Unknown",
    time: e.date.toISOString(),
    description: e.description || "",
    participants: "Group",
    url: e.url || "#"
  }));

  const dbPast = await prisma.event.findMany({
    where: { date: { lt: now } },
    orderBy: { date: "desc" },
    include: {
      results: {
        include: { user: true },
        orderBy: { score: "desc" }
      }
    }
  });

  const past = dbPast.map((e) => {
    const userResult = e.results.find((r) => r.userId === dbUser.id);
    const leaderboard = e.results.map((r, idx) => ({
      rank: (idx + 1).toString(),
      name: r.userId === dbUser.id ? "You" : r.user.name,
      score: r.score.toString()
    }));

    return {
      id: e.id,
      title: e.title,
      type: e.type,
      date: e.date.toISOString(),
      yourRank: userResult ? leaderboard.find((l) => l.name === "You")?.rank || "-" : "-",
      yourScore: userResult ? userResult.score.toString() : "-",
      xpEarned: userResult ? userResult.xpEarned : 0,
      leaderboard
    };
  });

  return <EventsClient initialUpcoming={upcoming} initialPast={past} />;
}
