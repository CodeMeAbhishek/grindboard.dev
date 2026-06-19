import type { Metadata } from "next";
import { SettingsClient } from "./SettingsClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings — Grindboard",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsClient email={user.email || ""} />;
}
