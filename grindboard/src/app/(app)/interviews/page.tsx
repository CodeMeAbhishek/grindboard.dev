import { Metadata } from "next";
import fs from "fs/promises";
import path from "path";
import InterviewsClient from "./InterviewsClient";

export const metadata: Metadata = {
  title: "Interview Experiences - Grindboard",
  description: "Browse interview experiences from top companies.",
};

export default async function InterviewsPage() {
  // Read the JSON file asynchronously on the server
  const filePath = path.join(process.cwd(), "prisma", "data", "interview_prep.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const interviewData = JSON.parse(fileContents);

  return <InterviewsClient data={interviewData} />;
}
