// ──────────────────────────────────────────────────────────
//  Grindboard Gamification Engine
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

export const LEVELS = [
  { name: "Beginner",     minXP: 0,      color: "level-beginner" },
  { name: "Learner",      minXP: 500,    color: "level-learner" },
  { name: "Intermediate", minXP: 1500,   color: "level-intermediate" },
  { name: "Advanced",     minXP: 4000,   color: "level-advanced" },
  { name: "Expert",       minXP: 10000,  color: "level-expert" },
  { name: "Legend",       minXP: 25000,  color: "level-legend" },
] as const;

export type LevelName = (typeof LEVELS)[number]["name"];

export function getLevel(xp: number): (typeof LEVELS)[number] {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(xp: number): (typeof LEVELS)[number] | null {
  const curr = getLevel(xp);
  const idx = LEVELS.findIndex((l) => l.name === curr.name);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(xp: number): number {
  const curr = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.minXP - curr.minXP;
  const earned = xp - curr.minXP;
  return Math.min(100, Math.round((earned / range) * 100));
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
