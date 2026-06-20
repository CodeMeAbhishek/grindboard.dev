import type { Metadata } from "next";
import { LeaderboardClient } from "./LeaderboardClient";

export const metadata: Metadata = {
 title: "Leaderboard — Grindboard",
 description: "Global group rankings by rating, streaks, and problems solved",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
