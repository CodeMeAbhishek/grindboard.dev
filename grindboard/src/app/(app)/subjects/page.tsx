import type { Metadata } from "next";
import { SubjectsClient } from "./SubjectsClient";
import { getAuthenticatedUser } from "@/lib/data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
 title: "Subjects — Grindboard",
 description: "Manage your study modules and track streaks",
};

export default async function SubjectsPage() {
  const { authUser, dbUser } = await getAuthenticatedUser();

  if (!authUser || !dbUser) {
    redirect("/login");
  }

  return <SubjectsClient userId={dbUser.id} />;
}
