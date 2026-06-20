import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
 title: "Dashboard — Grindboard",
 description: "Your daily study agenda, streak status, and group activity feed",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
