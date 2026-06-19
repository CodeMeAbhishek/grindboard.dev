// ──────────────────────────────────────────────────────────
// Grindboard Gamification Engine
// ──────────────────────────────────────────────────────────

export const XP_VALUES = {
 // LeetCode
 LC_EASY: 30,
 LC_MEDIUM: 60,
 LC_HARD: 100,
 // Codeforces (by division)
 CF_DIV3_DIV4: 40,
 CF_DIV1_DIV2: 80,
 // Study
 STUDY_HOUR: 20,
 // Topic
 TOPIC_COMPLETE: 50,
 // Events
 GATE_MOCK: 150,
 EVENT_PARTICIPATION: 75,
 // Bonuses
 PERFECT_WEEK: 200,
 STREAK_7_DAY: 100,
 STREAK_30_DAY: 500,
} as const;

export const SKILL_TIERS = [
  { name: "Unranked", minScore: -1, color: "text-on-surface-variant" },
  { name: "Beginner", minScore: 0, color: "level-beginner" },
  { name: "Novice", minScore: 1200, color: "text-green-500" },
  { name: "Intermediate", minScore: 1400, color: "level-intermediate" },
  { name: "Advanced", minScore: 1600, color: "level-advanced" },
  { name: "Expert", minScore: 1900, color: "level-expert" },
  { name: "Legend", minScore: 2100, color: "level-legend" },
] as const;

export type SkillLevelName = (typeof SKILL_TIERS)[number]["name"];

export function getSkillLevel(cfRating: number | null, lcRating: number | null): (typeof SKILL_TIERS)[number] {
  if (!cfRating && !lcRating) return SKILL_TIERS[0]; // Unranked

  const cfScore = cfRating || 0;
  // Normalize LeetCode rating to roughly match Codeforces difficulty scale
  const lcScore = lcRating ? Math.max(0, lcRating - 300) : 0;
  
  const grindboardScore = Math.max(cfScore, lcScore);

  for (let i = SKILL_TIERS.length - 1; i >= 0; i--) {
    if (grindboardScore >= SKILL_TIERS[i].minScore) return SKILL_TIERS[i];
  }
  
  return SKILL_TIERS[1]; // Fallback to Beginner
}

/** Calculate XP for an LC submission */
export function calcLCXP(difficulty: "EASY" | "MEDIUM" | "HARD"): number {
 const map = { EASY: XP_VALUES.LC_EASY, MEDIUM: XP_VALUES.LC_MEDIUM, HARD: XP_VALUES.LC_HARD };
 return map[difficulty];
}

/** Calculate XP for a CF contest */
export function calcCFXP(ratingChange: number, division: 1 | 2 | 3 | 4): number {
 const base = division <= 2 ? XP_VALUES.CF_DIV1_DIV2 : XP_VALUES.CF_DIV3_DIV4;
 const bonus = ratingChange > 0 ? Math.floor(ratingChange / 10) : 0;
 return base + bonus;
}

/** Badge definitions */
export const BADGE_DEFINITIONS = [
 {
 key: "first_blood",
 name: "First Blood",
 description: "Solved your first problem",
 icon: "workspace_premium",
 xpReward: 50,
 },
 {
 key: "streak_starter",
 name: "Streak Starter",
 description: "Achieved a 7-day streak",
 icon: "local_fire_department",
 xpReward: 100,
 },
 {
 key: "month_warrior",
 name: "Month Warrior",
 description: "Maintained a 30-day streak",
 icon: "military_tech",
 xpReward: 500,
 },
 {
 key: "century_solver",
 name: "Century Solver",
 description: "Solved 100 LeetCode problems",
 icon: "emoji_events",
 xpReward: 300,
 },
 {
 key: "rated",
 name: "Rated!",
 description: "Participated in your first CF contest",
 icon: "leaderboard",
 xpReward: 100,
 },
 {
 key: "gate_crasher",
 name: "Gate Crasher",
 description: "Completed 10 GATE mock tests",
 icon: "school",
 xpReward: 250,
 },
 {
 key: "all_rounder",
 name: "All-Rounder",
 description: "Active in 4+ modules in the same week",
 icon: "auto_awesome",
 xpReward: 200,
 },
 {
 key: "event_regular",
 name: "Event Regular",
 description: "Participated in 10 events",
 icon: "calendar_today",
 xpReward: 150,
 },
] as const;

/** Module definitions for seeding */
export const DEFAULT_MODULES = [
 {
 name: "Competitive Programming",
 description: "Codeforces, AtCoder, ICPC — competitive problem solving",
 icon: "terminal",
 color: "#10B981",
 orderIndex: 0,
 },
 {
 name: "LeetCode DSA",
 description: "LeetCode problems — data structures & algorithms",
 icon: "data_object",
 color: "#0EA5E9",
 orderIndex: 1,
 },
 {
 name: "GATE Preparation",
 description: "Graduate Aptitude Test in Engineering preparation",
 icon: "school",
 color: "#F59E0B",
 orderIndex: 2,
 },
 {
 name: "Machine Learning",
 description: "ML algorithms, deep learning, and AI fundamentals",
 icon: "psychology",
 color: "#8B5CF6",
 orderIndex: 3,
 },
 {
 name: "DSA",
 description: "Core data structures and algorithms fundamentals",
 icon: "account_tree",
 color: "#3B82F6",
 orderIndex: 4,
 },
 {
 name: "Web Development",
 description: "Frontend, backend, and full-stack web technologies",
 icon: "code_blocks",
 color: "#EF4444",
 orderIndex: 5,
 },
] as const;

/** Get module color based on name */
export function getModuleColor(name: string): string {
 const mod = DEFAULT_MODULES.find((m) => m.name === name);
 return mod?.color ?? "#10B981";
}

/** Get module icon based on name */
export function getModuleIcon(name: string): string {
 const mod = DEFAULT_MODULES.find((m) => m.name === name);
 return mod?.icon ?? "book";
}
