import { config } from "dotenv";
config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { BADGE_DEFINITIONS, DEFAULT_MODULES } from "../src/lib/gamification";

async function main() {
  const { prisma } = await import("../src/lib/prisma");
  console.log("🌱 Seeding Grindboard database...");

  // ── 1. Seed Modules ──────────────────────────────────────────
  for (const mod of DEFAULT_MODULES) {
    await prisma.module.upsert({
      where: { name: mod.name },
      update: {},
      create: mod,
    });
  }
  console.log("✅ Modules seeded:", DEFAULT_MODULES.length);

  // ── 2. Seed Badges ───────────────────────────────────────────
  for (const badge of BADGE_DEFINITIONS) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: {},
      create: badge,
    });
  }
  console.log("✅ Badges seeded:", BADGE_DEFINITIONS.length);

  // ── 3. Seed Admin User (supabaseId is placeholder) ───────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@grindboard.dev" },
    update: {},
    create: {
      email: "admin@grindboard.dev",
      name: "Grindboard Admin",
      supabaseId: "seed-admin-placeholder-id",
      role: "ADMIN",
      lcRating: 1500,
      cfRating: 1200,
    },
  });
  console.log("✅ Admin user seeded:", admin.email);

  // ── 4. Seed Topics for each Module ───────────────────────────
  const topicsMap: Record<string, string[]> = {
    "Competitive Programming": [
      "Graph Algorithms", "Dynamic Programming", "Segment Trees",
      "Fenwick Tree (BIT)", "Network Flow", "String Algorithms",
      "Shortest Paths", "Greedy Algorithms",
    ],
    "LeetCode DSA": [
      "Arrays & Hashing", "Two Pointers", "Sliding Window",
      "Stack", "Binary Search", "Trees", "Heap / Priority Queue",
      "Backtracking", "Graphs", "Dynamic Programming",
    ],
    "GATE Preparation": [
      "Digital Logic", "Computer Organization & Architecture",
      "Theory of Computation", "Compiler Design", "Operating Systems",
      "Database Management", "Computer Networks", "Data Structures",
    ],
    "Machine Learning": [
      "Linear Regression", "Logistic Regression", "Neural Networks",
      "CNNs", "RNNs & Transformers", "SVMs", "Clustering", "Dimensionality Reduction",
    ],
    "DSA": [
      "Arrays", "Linked Lists", "Stacks & Queues", "Trees",
      "Graphs", "Hashing", "Sorting Algorithms", "Recursion",
    ],
    "Web Development": [
      "HTML & CSS", "JavaScript Fundamentals", "React Basics",
      "Next.js", "Node.js", "REST APIs", "Databases", "Deployment",
    ],
  };

  let topicCount = 0;
  for (const [moduleName, topics] of Object.entries(topicsMap)) {
    const module = await prisma.module.findUnique({ where: { name: moduleName } });
    if (!module) continue;

    for (let i = 0; i < topics.length; i++) {
      // Find existing topic by module ID and name
      let topic = await prisma.topic.findFirst({
        where: { moduleId: module.id, name: topics[i] }
      });

      if (!topic) {
        topic = await prisma.topic.create({
          data: {
            moduleId: module.id,
            name: topics[i],
            orderIndex: i,
          },
        });
        topicCount++;
      }
    }
  }
  console.log(`✅ Default topics ensured (seeded or existed): ${topicCount} new`);

  // ── 5. Seed Codeforces 800 Material ──────────────────────────
  const cpModule = await prisma.module.findUnique({ where: { name: "Competitive Programming" } });
  if (cpModule) {
    let cf800Topic = await prisma.topic.findFirst({
      where: { moduleId: cpModule.id, name: "800 Rating" }
    });

    if (!cf800Topic) {
      cf800Topic = await prisma.topic.create({
        data: {
          moduleId: cpModule.id,
          name: "800 Rating",
          orderIndex: 0, // Put it at the top for CP
        }
      });
      console.log("✅ Created '800 Rating' Topic under CP");
    }

    try {
      const cf800Data = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "cf_800.json"), "utf8"));
      let materialCount = 0;
      for (let i = 0; i < cf800Data.problems.length; i++) {
        const p = cf800Data.problems[i];
        
        // check if material exists
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
          materialCount++;
        }
      }
      console.log(`✅ Seeded ${materialCount} new materials to '800 Rating'`);
    } catch (e) {
      console.warn("⚠️ Could not load or seed cf_800.json", e);
    }
  }

  console.log("\n🎉 Seed complete!");
  console.log("   Admin: admin@grindboard.dev");
  console.log("   Note: Create Supabase user in Auth dashboard to get the supabase_id,");
  console.log("   then UPDATE users SET supabase_id = '<actual-id>' WHERE email = 'admin@grindboard.dev'");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
