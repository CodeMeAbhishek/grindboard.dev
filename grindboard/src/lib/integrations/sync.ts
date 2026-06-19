import { prisma } from "@/lib/prisma";
import { getCFRecentSubmissions, getCFRating } from "./codeforces";
import { getLCRecentSubmissions, getLCProblemDifficulty } from "./leetcode";
import { calcCFXP, calcLCXP } from "@/lib/gamification";

export async function syncUserProgress(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      activities: {
        where: { source: { in: ["CODEFORCES_API", "LEETCODE_API"] } },
        orderBy: { createdAt: "desc" },
        take: 100, // Look at last 100 API activities to prevent duplicates
      }
    }
  });

  if (!user) throw new Error("User not found");

  const existingExternalIds = new Set(user.activities.map(a => a.externalId));
  let xpGained = 0;
  let newActivities = 0;

  // 1. Sync Codeforces
  if (user.cfHandle) {
    // Update Rating
    const rating = await getCFRating(user.cfHandle);
    if (rating !== null) {
      // Could store rating history in a separate model, for now just update metadata or user profile if we had a rating field
      // Wait, we don't have a global rating field, but we can log contests as events.
    }

    // Sync recent accepted submissions
    const cfSubs = await getCFRecentSubmissions(user.cfHandle);
    const acceptedCfSubs = cfSubs.filter(sub => sub.verdict === "OK" && sub.problem && sub.problem.contestId);
    
    // Find the default CF module
    const cfModule = await prisma.module.findFirst({ where: { name: { contains: "Competitive Programming", mode: "insensitive" } } });

    for (const sub of acceptedCfSubs) {
      const extId = `CF_${sub.id}`;
      if (existingExternalIds.has(extId)) continue; // Skip existing

      // For CF, xp is based on rating or division. Defaulting to 40 for standard practice.
      const xp = calcCFXP(0, 3); // Mock division 3 for practice

      await prisma.activity.create({
        data: {
          userId: user.id,
          moduleId: cfModule?.id,
          type: "CODEFORCES",
          source: "CODEFORCES_API",
          externalId: extId,
          xpEarned: xp,
          cfContestId: sub.problem.contestId,
          notes: sub.problem.name,
          createdAt: new Date(sub.creationTimeSeconds * 1000)
        }
      });
      existingExternalIds.add(extId);
      xpGained += xp;
      newActivities++;
    }
  }

  // 2. Sync LeetCode
  if (user.lcHandle) {
    const lcSubs = await getLCRecentSubmissions(user.lcHandle);
    const lcModule = await prisma.module.findFirst({ where: { name: { contains: "LeetCode", mode: "insensitive" } } });

    for (const sub of lcSubs) {
      const extId = `LC_${sub.id || sub.timestamp}`;
      if (existingExternalIds.has(extId)) continue; // Skip existing

      // Fetch problem difficulty to calculate accurate XP
      let diffStr = await getLCProblemDifficulty(sub.titleSlug);
      if (!diffStr) diffStr = "EASY"; // Fallback
      
      const xp = calcLCXP(diffStr as "EASY" | "MEDIUM" | "HARD");

      await prisma.activity.create({
        data: {
          userId: user.id,
          moduleId: lcModule?.id,
          type: "LEETCODE",
          source: "LEETCODE_API",
          externalId: extId,
          xpEarned: xp,
          lcDifficulty: diffStr as any,
          lcProblemName: sub.title,
          notes: sub.title,
          createdAt: new Date(parseInt(sub.timestamp) * 1000)
        }
      });
      existingExternalIds.add(extId);
      xpGained += xp;
      newActivities++;
    }
  }

  // 3. Update User Total XP and Last Sync Time
  if (xpGained > 0 || newActivities > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        xpTotal: { increment: xpGained },
        lastSyncAt: new Date()
      }
    });
  } else {
    // Just update sync time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSyncAt: new Date() }
    });
  }

  return { newActivities, xpGained };
}
