import { HistoryClient } from "./HistoryClient";
import { Suspense } from "react";
import { SkeletonPage } from "@/components/skeletons";

export const metadata = {
  title: "History — Grindboard",
  description: "Your full activity history",
};

export default function HistoryPage() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <HistoryClient />
    </Suspense>
  );
}
