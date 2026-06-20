import type { Metadata } from "next";
import ContestsClient from "./ContestsClient";

export const metadata: Metadata = {
  title: "Contests — Grindboard",
  description: "Upcoming and past competitive programming contests",
};

export default function ContestsPage() {
  return <ContestsClient />;
}
