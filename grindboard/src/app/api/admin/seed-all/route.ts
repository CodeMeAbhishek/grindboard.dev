import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cf800Data from "../../../../../prisma/data/cf_800.json";

export async function POST() {
  try {
    let cpModule = await prisma.module.findUnique({ where: { name: "Competitive Programming" } });
    
    if (!cpModule) {
      cpModule = await prisma.module.create({
        data: {
          name: "Competitive Programming",
          description: "Master algorithms and data structures",
          icon: "terminal",
          color: "#10B981",
          orderIndex: 0,
        }
      });
    }

    let cf800Topic = await prisma.topic.findFirst({
      where: { moduleId: cpModule.id, name: "800 Rating" }
    });

    if (!cf800Topic) {
      cf800Topic = await prisma.topic.create({
        data: {
          moduleId: cpModule.id,
          name: "800 Rating",
          orderIndex: 0,
        }
      });
    }

    let count = 0;
    for (let i = 0; i < cf800Data.problems.length; i++) {
      const p = cf800Data.problems[i];
      const existingMaterial = await prisma.material.findFirst({
        where: { topicId: cf800Topic.id, title: p.name }
      });

      if (!existingMaterial) {
        await prisma.material.create({
          data: {
            topicId: cf800Topic.id,
            title: p.name,
            url: p.url,
            type: "LINK",
            orderIndex: p.index,
          }
        });
        count++;
      }
    }

    return NextResponse.json({ success: true, count, cpModule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
