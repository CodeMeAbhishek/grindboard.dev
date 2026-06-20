import type { Metadata } from "next";
import { SubjectDetailClient } from "./SubjectDetailClient";

export const metadata: Metadata = {
 title: "Subject Detail — Grindboard",
 description: "Topics, progress, recent activity, and stats for a module",
};

export default async function SubjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SubjectDetailClient subjectId={id} />;
}
