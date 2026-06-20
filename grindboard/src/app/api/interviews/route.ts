import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "prisma", "data", "interview_prep.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const interviewData = JSON.parse(fileContents);
    return NextResponse.json(interviewData);
  } catch (error) {
    console.error("GET /api/interviews error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
