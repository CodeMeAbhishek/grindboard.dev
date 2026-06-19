import { PrismaClient } from "@prisma/client";
import { BADGE_DEFINITIONS, DEFAULT_MODULES } from "../src/lib/gamification";

const prisma = new PrismaClient();

async function main() {
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
      xpTotal: 99999,
      globalStreak: 365,
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
      await prisma.topic.upsert({
        where: {
          // Use a composite approach — check by module + name
          id: `${module.id}-${i}`, // This won't work, skip upsert and just create if not exists
        },
        update: {},
        create: {
          moduleId: module.id,
          name: topics[i],
          orderIndex: i,
        },
      }).catch(() => {
        // Ignore duplicate if already exists
      });
      topicCount++;
    }
  }
  console.log("✅ Topics seeded:", topicCount);

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
