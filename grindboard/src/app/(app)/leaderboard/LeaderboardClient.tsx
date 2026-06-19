"use client";

import { useState } from "react";
import { formatXP } from "@/lib/utils";
import { getLevel } from "@/lib/gamification";

interface LeaderUser {
  id: string;
  rank: number;
  name: string;
  level: string;
  xp: number;
  streak: number;
  problems: number;
  isCurrentUser?: boolean;
}

interface LeaderboardClientProps {
  initialData: Omit<LeaderUser, "rank" | "level">[];
}

const HOF = [
  { name: "Alex Rivera", record: "42-day streak", icon: "local_fire_department", color: "text-[#F59E0B]" },
  { name: "Priya Sharma", record: "312 LC problems", icon: "code", color: "text-[#0EA5E9]" },
  { name: "Jordan Kim", record: "GATE 99.2%tile", icon: "school", color: "text-primary" },
];

type SortKey = "xp" | "streak" | "problems";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-full bg-[#FEF9C3] border border-[#F59E0B]/30 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#F59E0B] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        emoji_events
      </span>
    </div>
  );
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] border border-[#6B7280]/30 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#6B7280] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        emoji_events
      </span>
    </div>
  );
  if (rank === 3) return (
    <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#D97706]/30 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#D97706] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        emoji_events
      </span>
    </div>
  );
  return (
    <div className="w-8 h-8 rounded-full bg-[#F9FAFB] border border-[#E5E5E5] flex items-center justify-center font-label-mono text-sm text-[#6B7280]">
      {rank}
    </div>
  );
}

export function LeaderboardClient({ initialData }: LeaderboardClientProps) {
  const [sort, setSort] = useState<SortKey>("xp");
  const [tab, setTab] = useState<"global" | "weekly">("global");

  const fullData = initialData.map(u => ({ ...u, level: getLevel(u.xp).name }));
  const sorted = [...fullData].sort((a, b) => b[sort] - a[sort]).map((u, i) => ({ ...u, rank: i + 1 }));
  const currentUser = sorted.find((u) => u.isCurrentUser);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-[#1A1A1A] tracking-tight">
            Leaderboard
          </h1>
          <p className="text-[#6B7280] mt-0.5">Compete with your grind group across all metrics.</p>
        </div>
        <div className="flex bg-[#F3F4F6] p-1 rounded-lg border border-[#E5E5E5] shadow-panel">
          {(["global", "weekly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md font-label-mono text-sm capitalize transition-all ${
                tab === t ? "tab-active" : "tab-inactive"
              }`}
            >
              {t === "global" ? "All-Time" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sort Controls */}
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { key: "xp", label: "XP", icon: "bolt" },
                { key: "streak", label: "Streak", icon: "local_fire_department" },
                { key: "problems", label: "Problems", icon: "code" },
              ] as { key: SortKey; label: string; icon: string }[]
            ).map((s) => (
              <button
                key={s.key}
                onClick={() => setSort(s.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-label-mono text-sm border transition-all ${
                  sort === s.key
                    ? "bg-[#F0FDF4] text-primary border-primary/30"
                    : "bg-white text-[#6B7280] border-[#E5E5E5] hover:text-[#1A1A1A]"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#E5E5E5] bg-[#F9FAFB] flex items-center justify-between">
              <h2 className="font-label-mono text-sm text-[#6B7280] uppercase tracking-wider">
                Rankings
              </h2>
              <span className="font-label-mono text-xs text-[#6B7280]">
                {sorted.length} members
              </span>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              {sorted.length === 0 ? (
                <div className="text-center py-6 text-[#6B7280] font-label-mono text-sm">
                  No users to display.
                </div>
              ) : sorted.map((user) => (
                <div
                  key={user.id}
                  className={`p-4 flex items-center gap-4 hover:bg-[#F9FAFB] transition-colors ${
                    user.isCurrentUser ? "bg-[#F0FDF4]" : ""
                  }`}
                >
                  <RankBadge rank={user.rank} />

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-label-mono border uppercase ${
                        user.isCurrentUser
                          ? "bg-[#F0FDF4] border-primary/30 text-primary"
                          : "bg-[#F9FAFB] border-[#E5E5E5] text-[#6B7280]"
                      }`}
                    >
                      {user.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${user.isCurrentUser ? "text-primary" : "text-[#1A1A1A]"}`}>
                        {user.name} {user.isCurrentUser && "(You)"}
                      </p>
                      <p className="text-xs text-[#6B7280] font-label-mono">{user.level}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex gap-6 text-right">
                    <div>
                      <p className={`font-stat-lg text-sm ${sort === "xp" ? "text-primary font-bold" : "text-[#1A1A1A]"}`}>
                        {formatXP(user.xp)}
                      </p>
                      <p className="text-[10px] text-[#6B7280] font-label-mono uppercase">XP</p>
                    </div>
                    <div>
                      <p className={`font-stat-lg text-sm ${sort === "streak" ? "text-[#F59E0B] font-bold" : "text-[#1A1A1A]"}`}>
                        {user.streak}🔥
                      </p>
                      <p className="text-[10px] text-[#6B7280] font-label-mono uppercase">Days</p>
                    </div>
                    <div>
                      <p className={`font-stat-lg text-sm ${sort === "problems" ? "text-[#0EA5E9] font-bold" : "text-[#1A1A1A]"}`}>
                        {user.problems}
                      </p>
                      <p className="text-[10px] text-[#6B7280] font-label-mono uppercase">Solved</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Position */}
          {currentUser && (
            <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 border-primary">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F0FDF4] border border-primary/30 flex items-center justify-center text-sm font-label-mono text-primary">
                  #{currentUser.rank}
                </div>
                <div>
                  <p className="font-medium text-primary text-sm">Your Position</p>
                  <p className="text-xs text-[#6B7280] font-label-mono">{formatXP(currentUser.xp)} XP · {currentUser.streak}🔥 streak</p>
                </div>
              </div>
              <span className="text-xs text-[#6B7280] font-label-mono">
                {currentUser.rank <= 3 ? "🏆 You're in the top 3!" : `${currentUser.rank - 1} place${currentUser.rank - 1 > 1 ? "s" : ""} ahead`}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#E5E5E5] bg-[#F9FAFB]">
              <h2 className="font-label-mono text-sm text-[#6B7280] uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F59E0B] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
                Hall of Fame
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {HOF.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5]">
                  <div className={`w-8 h-8 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center ${entry.color}`}>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {entry.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{entry.name}</p>
                    <p className="text-xs text-[#6B7280] font-label-mono">{entry.record}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
