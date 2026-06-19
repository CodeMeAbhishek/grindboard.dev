"use client";

import { useState } from "react";
import { getSkillLevel } from "@/lib/gamification";
import { formatXP, timeAgo } from "@/lib/utils";

// Types derived from Prisma models
type Module = { id: string; name: string; icon: string; color: string };
type Goal = { id: string; title: string; moduleId: string | null; targetValue: number; currentValue: number; module: Module | null; archived: boolean };
type Streak = { id: string; moduleId: string | null; current: number; module: Module | null };
type Activity = { id: string; type: string; xpEarned: number; lcProblemName: string | null; lcDifficulty: string | null; cfRating: number | null; cfContestId: number | null; studyHours: number | null; notes: string | null; externalId: string | null; createdAt: Date; module: Module | null; user: { name: string; cfHandle: string | null } };

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
 const level = getSkillLevel(user.cfRating, user.lcRating);

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
 if (item.type === "LEETCODE") {
 const href = `https://leetcode.com/problems/${item.notes?.toLowerCase().replace(/\s+/g, '-') || ""}`;
 return (
 <span>
 solved a {item.lcDifficulty || ""} problem <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline">{item.notes || "on LeetCode"}</a>
 </span>
 );
 }
 if (item.type === "CODEFORCES") {
 const subId = item.externalId?.replace('CF_', '');
 const href = item.cfContestId ? `https://codeforces.com/contest/${item.cfContestId}/submission/${subId}` : `https://codeforces.com/`;
 return (
 <span>
 solved Codeforces problem <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0EA5E9] hover:underline">{item.notes || ""}</a>
 </span>
 );
 }
 if (item.type === "STUDY") return <span>studied for {item.studyHours || 0} hours</span>;
 return <span>logged an activity in {item.module?.name || "General"}</span>;
 }

 return (
 <div className="space-y-8">
 {/* ── Header ─────────────────────────────────────────────── */}
 <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
 <div>
 <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-background mb-1">
 Welcome back, {user.name}
 </h1>
 <p className="text-on-surface-variant font-label-mono text-sm flex items-center gap-2">
 <span className="bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded text-xs border border-[#0EA5E9]/30">
 {level.name}
 </span>
 </p>
 </div>

 {/* Streak chips + Rank display */}
 <div className="flex items-center gap-sm bg-surface border border-outline shadow-panel p-2 rounded-lg w-full md:w-auto">
 <div className="flex flex-wrap items-center gap-2">
 {displayStreaks.map((s) => (
 <div
 key={s.label}
 className="flex items-center gap-1 bg-surface-container border border-outline px-2 py-1 rounded text-xs font-label-mono"
 >
 <span className="text-on-surface-variant">{s.label}</span>
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
        <div className="bg-surface border border-outline shadow-panel p-md rounded-lg flex flex-col md:col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="font-label-mono text-xs text-on-surface-variant uppercase tracking-wider mb-2">Rank</span>
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-3xl">military_tech</span>
            <div>
              <div className="font-stat-lg text-primary">{level.name}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

 {/* ── Announcement Banner ──────────────────────────────────── */}
 <section>
 <div className="bg-surface border-l-4 border-[#0EA5E9] rounded-r-lg flex items-center justify-between p-4 shadow-panel border border-outline border-l-[#0EA5E9]">
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
 <h3 className="font-label-mono text-sm text-on-background">
 {MOCK_ANNOUNCEMENT.title}
 </h3>
 </div>
 </div>
 <button className="bg-surface border border-[#0EA5E9]/50 text-[#0EA5E9] px-4 py-1.5 rounded font-label-mono text-xs hover:bg-[#E0F2FE] transition-colors shrink-0">
 {MOCK_ANNOUNCEMENT.cta}
 </button>
 </div>
 </section>

 {/* ── Main Grid ───────────────────────────────────────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
 {/* Left: Agenda */}
 <div className="lg:col-span-8 space-y-4">
 <h2 className="font-headline-lg-mobile text-on-background flex items-center gap-2 border-b border-outline pb-2">
 <span
 className="material-symbols-outlined text-primary"
 style={{ fontVariationSettings: "'FILL' 1" }}
 >
 view_list
 </span>
 Today&apos;s Agenda
 </h2>

 <div className="bg-surface border border-outline shadow-panel rounded-xl p-4 space-y-1">
 {agenda.length === 0 ? (
 <div className="text-center py-6 text-on-surface-variant font-label-mono text-sm">
 No active goals or agenda items found.
 </div>
 ) : agenda.map((item, idx) => (
 <div key={item.id}>
 <div
 className={`group flex items-center gap-3 p-2 rounded hover:bg-surface-container border border-transparent hover:border-outline cursor-pointer transition-all ${
 item.done ? "opacity-50" : ""
 }`}
 onClick={() => toggleItem(item.id)}
 >
 <div
 className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
 item.done
 ? "bg-primary border-primary"
 : "border-outline group-hover:border-primary"
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
 className={`font-body-md text-on-background text-sm ${
 item.done ? "line-through text-on-surface-variant" : ""
 }`}
 >
 {item.title}
 </h4>
 <p className="text-xs text-on-surface-variant font-label-mono">
 {item.subject}
 </p>
 </div>
 <div className="xp-badge shrink-0">+{item.xp} XP</div>
 </div>
 {idx < agenda.length - 1 && (
 <div className="h-px bg-outline mx-2" />
 )}
 </div>
 ))}
 </div>

 </div>

 {/* Right: Group Activity Feed */}
 <div className="lg:col-span-4 space-y-4">
 <h2 className="font-headline-lg-mobile text-on-background flex items-center gap-2 border-b border-outline pb-2">
 <span
 className="material-symbols-outlined text-[#0EA5E9]"
 style={{ fontVariationSettings: "'FILL' 1" }}
 >
 group
 </span>
 Group Activity
 </h2>

 <div className="bg-surface border border-outline shadow-panel rounded-xl p-4 space-y-4 max-h-[400px] overflow-y-auto">
 {feed.length === 0 ? (
 <div className="text-center py-6 text-on-surface-variant font-label-mono text-sm">
 No recent activity to display.
 </div>
 ) : feed.map((item) => (
 <div key={item.id} className="flex gap-3">
 <div className="w-8 h-8 rounded-full bg-[#F0FDF4] border border-primary/30 flex items-center justify-center text-xs font-label-mono text-primary shrink-0 uppercase">
 {item.user.name.slice(0, 2)}
 </div>
 <div>
 <p className="text-sm text-on-background">
 <strong>{item.user.name}</strong> {renderFeedAction(item)}
 {" "}
 <span className="text-primary font-label-mono">+{item.xpEarned} XP</span>
 </p>
 <span className="text-xs text-on-surface-variant">{timeAgo(new Date(item.createdAt))}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}
