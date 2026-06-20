import { Metadata } from "next";
import InterviewsClient from "./InterviewsClient";

export const metadata: Metadata = {
  title: "Interview Experiences - Grindboard",
  description: "Browse interview experiences from top companies.",
};

export default function InterviewsPage() {
  return <InterviewsClient />;
}
