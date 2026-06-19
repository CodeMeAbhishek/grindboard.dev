"use client";

import { useState } from "react";
import { getLevel, getLevelProgress, getNextLevel } from "@/lib/gamification";
import { formatXP, timeAgo } from "@/lib/utils";

// Types derived from Prisma models
type Module = { id: string; name: string; icon: string; color: string };
type Goal = { id: string; title: string; moduleId: string | null; targetValue: number; currentValue: number; module: Module | null; archived: boolean };
type Streak = { id: string; moduleId: string | null; current: number; module: Module | null };
type Activity = { id: string; type: string; xpEarned: number; lcProblemName: string | null; lcDifficulty: string | null; cfRating: number | null; studyHours: number | null; createdAt: Date; module: Module | null; user: { name: string } };

interface DashboardClientProps {
  user: {
    name: string;
    xpTotal: number;
    globalStreak: number;
    goals: Goal[];
    streaks: Streak[];
    activities: Activity[];
  };
  feed: Activity[];
}

const MOCK_ANNOUNCEMENT = {
  title: "New LeetCode Weekly Contest starts in 4 hours!",
  cta: "Join Group",
};

export function DashboardClient({ user, feed }: DashboardClientProps) {
  const level = getLevel(user.xpTotal);
  const nextLevel = getNextLevel(user.xpTotal);
  const progress = getLevelProgress(user.xpTotal);

  // For agenda, we'll map goals into agenda items
  // This is a simplified approach where goals are interactive tasks
  const initialAgenda = user.goals.map((g) => ({
    id: g.id,
    title: g.title,
    subject: g.module?.name || "General",
    priority: "Medium",
    xp: 50, // mock xp value for completing a goal
    done: g.currentValue >= g.targetValue,
  }));

  const [agenda, setAgenda] = useState(initialAgenda);

  function toggleItem(id: string) {
    setAgenda((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }

  // Format streaks for the UI
  const displayStreaks = user.streaks
    .filter((s) => s.current > 0)
    .map((s) => ({
      label: s.module?.name || "Global",
      streak: s.current,
    }));
  
  if (displayStreaks.length === 0) {
    displayStreaks.push({ label: "Global", streak: user.globalStreak });
  }

  function renderFeedAction(item: Activity) {
    if (item.type === "LEETCODE") return `solved a ${item.lcDifficulty || ""} problem ${item.lcProblemName || ""}`;
    if (item.type === "CODEFORCES") return `participated in contest with rating ${item.cfRating || ""}`;
    if (item.type === "STUDY") return `studied for ${item.studyHours || 0} hours`;
    return `logged an activity in ${item.module?.name || "General"}`;
  }

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-[#1A1A1A] mb-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-[#6B7280] font-label-mono text-sm flex items-center gap-2">
            <span className="bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded text-xs border border-[#0EA5E9]/30">
              {level.name}
            </span>
          </p>
        </div>

        {/* Streak chips + XP bar */}
        <div className="flex items-center gap-sm glass-panel p-2 rounded-lg w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            {displayStreaks.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-1 bg-[#F9FAFB] border border-[#E5E5E5] px-2 py-1 rounded text-xs font-label-mono"
              >
                <span className="text-[#6B7280]">{s.label}</span>
                <div className="flex items-center gap-0.5 text-[#F59E0B]">
                  <span>{s.streak}</span>
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-[#E5E5E5] mx-1" />
          <div className="w-36 md:w-48 shrink-0">
            <div className="flex justify-between text-xs text-[#6B7280] mb-1 font-label-mono">
              <span>XP Progress</span>
              <span className="text-primary">
                {formatXP(user.xpTotal)} / {nextLevel ? formatXP(nextLevel.minXP) : "MAX"}
              </span>
            </div>
            <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Announcement Banner ──────────────────────────────────── */}
      <section>
        <div className="bg-white border-l-4 border-[#0EA5E9] rounded-r-lg flex items-center justify-between p-4 shadow-panel border border-[#E5E5E5] border-l-[#0EA5E9]">
          <div className="flex items-center gap-3">
            <div className="bg-[#E0F2FE] p-2 rounded text-[#0EA5E9]">
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                campaign
              </span>
            </div>
            <div>
              <h3 className="font-label-mono text-sm text-[#1A1A1A]">
                {MOCK_ANNOUNCEMENT.title}
              </h3>
            </div>
          </div>
          <button className="bg-white border border-[#0EA5E9]/50 text-[#0EA5E9] px-4 py-1.5 rounded font-label-mono text-xs hover:bg-[#E0F2FE] transition-colors shrink-0">
            {MOCK_ANNOUNCEMENT.cta}
          </button>
        </div>
      </section>

      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Agenda */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-headline-lg-mobile text-[#1A1A1A] flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              view_list
            </span>
            Today&apos;s Agenda
          </h2>

          <div className="glass-panel rounded-xl p-4 space-y-1">
            {agenda.length === 0 ? (
               <div className="text-center py-6 text-[#6B7280] font-label-mono text-sm">
                 No active goals or agenda items found.
               </div>
            ) : agenda.map((item, idx) => (
              <div key={item.id}>
                <div
                  className={`group flex items-center gap-3 p-2 rounded hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E5E5] cursor-pointer transition-all ${
                    item.done ? "opacity-50" : ""
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                      item.done
                        ? "bg-primary border-primary"
                        : "border-[#E5E5E5] group-hover:border-primary"
                    }`}
                  >
                    {item.done && (
                      <span className="material-symbols-outlined text-white text-sm">
                        check
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-body-md text-[#1A1A1A] text-sm ${
                        item.done ? "line-through text-[#6B7280]" : ""
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#6B7280] font-label-mono">
                      {item.subject}
                    </p>
                  </div>
                  <div className="xp-badge shrink-0">+{item.xp} XP</div>
                </div>
                {idx < agenda.length - 1 && (
                  <div className="h-px bg-[#E5E5E5] mx-2" />
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Right: Group Activity Feed */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="font-headline-lg-mobile text-[#1A1A1A] flex items-center gap-2 border-b border-[#E5E5E5] pb-2">
            <span
              className="material-symbols-outlined text-[#0EA5E9]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              group
            </span>
            Group Activity
          </h2>

          <div className="glass-panel rounded-xl p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {feed.length === 0 ? (
               <div className="text-center py-6 text-[#6B7280] font-label-mono text-sm">
                 No recent activity to display.
               </div>
            ) : feed.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0FDF4] border border-primary/30 flex items-center justify-center text-xs font-label-mono text-primary shrink-0 uppercase">
                  {item.user.name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm text-[#1A1A1A]">
                    <strong>{item.user.name}</strong> {renderFeedAction(item)}
                    {" "}
                    <span className="text-primary font-label-mono">+{item.xpEarned} XP</span>
                  </p>
                  <span className="text-xs text-[#6B7280]">{timeAgo(new Date(item.createdAt))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
