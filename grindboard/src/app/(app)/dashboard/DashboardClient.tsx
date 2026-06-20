"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSkillLevel } from "@/lib/gamification";
import { timeAgo } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { DashboardSkeleton } from "@/components/skeletons";

// Types derived from Prisma models
type Module = { id: string; name: string; icon: string; color: string };
type Streak = { id: string; moduleId: string | null; current: number; module: Module | null };
type Activity = { id: string; type: string; lcProblemName: string | null; lcDifficulty: string | null; cfRating: number | null; cfContestId: number | null; studyHours: number | null; notes: string | null; externalId: string | null; createdAt: Date; module: Module | null; user: { id: string; name: string; cfHandle: string | null; username?: string } };

interface DashboardData {
 user: {
  name: string;
  cfRating: number | null;
  lcRating: number | null;
  globalStreak: number;
  streaks: Streak[];
  activities: Activity[];
  enrollments?: { id: string; module: Module }[];
 };
 feed: Activity[];
 upcomingContests?: { title: string; scheduledAt: Date; type: string; platformUrl: string | null }[];
}

export function DashboardClient() {
 const { data, isLoading, error } = useQuery<DashboardData>({
   queryKey: ['dashboard'],
   queryFn: async () => {
     const res = await fetch('/api/dashboard');
     if (!res.ok) throw new Error('Failed to fetch dashboard data');
     return res.json();
   }
 });

 const [agenda, setAgenda] = useState<{id: string, title: string, subject: string, priority: string, done: boolean, type: "enrollment" | "task"}[]>([]);

 useEffect(() => {
   if (data) {
     const enrollmentAgenda = (data.user.enrollments || []).map((e, index) => {
       const messages = [
         "Continue learning and don't break your streak!",
         "Do not get left behind, keep grinding!",
         "Review today's concepts to stay ahead.",
         "Push your limits today!"
       ];
       return {
         id: `enroll-${e.id}`,
         title: messages[index % messages.length],
         subject: e.module.name,
         priority: "High",
         done: false,
         type: "enrollment" as const
       };
     });
     setAgenda(enrollmentAgenda);
   }
 }, [data]);

 if (isLoading) {
   return <DashboardSkeleton />;
 }

 if (error || !data) {
   return <div className="p-8 text-red-500 text-center">Failed to load dashboard.</div>;
 }

 const { user, feed, upcomingContests } = data;

 const level = getSkillLevel(user.cfRating, user.lcRating);

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
 <div className="space-y-8 animate-fade-in">
 {/* ── Header ─────────────────────────────────────────────── */}
 <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
 <div>
 <div className="text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
   <span className="material-symbols-outlined text-[16px]">calendar_today</span>
   {format(new Date(), "EEEE, MMM d, yyyy")}
 </div>
 <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-background mb-1">
 Welcome back, {user.name}
 </h1>
 <p className="text-on-surface-variant font-label-mono text-sm flex items-center gap-2">
 <span className="bg-[#E0F2FE] text-[#0369A1] px-2 py-0.5 rounded text-xs border border-[#0EA5E9]/30">
 {level.name}
 </span>
 </p>
 </div>

 {/* Right side containers */}
 <div className="flex items-stretch gap-3 w-full md:w-auto">
   {/* Streaks Panel */}
   <div className="flex items-center gap-3 bg-surface border border-outline shadow-panel p-3 rounded-xl flex-1 md:flex-none">
     <div className="flex flex-wrap items-center gap-2">
       {displayStreaks.map((s) => (
         <div
           key={s.label}
           className="flex items-center gap-1.5 bg-surface-container border border-outline px-2.5 py-1 rounded-md text-xs font-label-mono"
         >
           <span className="text-on-surface-variant">{s.label}</span>
           <div className="flex items-center gap-0.5 text-[#F59E0B]">
             <span className="font-bold">{s.streak}</span>
             <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
               local_fire_department
             </span>
           </div>
         </div>
       ))}
     </div>
   </div>

   {/* Rank Panel */}
   <div className="bg-surface border border-outline shadow-panel px-4 py-2 rounded-xl flex items-center gap-3 relative overflow-hidden group flex-1 md:flex-none">
     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
     <div className="flex flex-col justify-center">
       <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Rank</span>
       <div className="font-bold text-primary text-base leading-none">{level.name}</div>
     </div>
     <span className="material-symbols-outlined text-primary text-2xl ml-1">military_tech</span>
   </div>
 </div>
    </section>

  {/* ── Announcement Banner ──────────────────────────────────── */}
  {upcomingContests && upcomingContests.length > 0 && (
  <section className="space-y-3">
    {upcomingContests.map((contest, i) => {
      const isLeetCode = contest.type === 'LEETCODE';
      const borderColor = isLeetCode ? 'border-l-[#F59E0B]' : 'border-l-[#3B82F6]';
      const bgColor = isLeetCode ? 'bg-[#FEF3C7]' : 'bg-[#DBEAFE]';
      const textColor = isLeetCode ? 'text-[#D97706]' : 'text-[#2563EB]';
      const btnColor = isLeetCode ? 'border-[#F59E0B]/50 text-[#D97706] hover:bg-[#FEF3C7]' : 'border-[#3B82F6]/50 text-[#2563EB] hover:bg-[#DBEAFE]';
      
      return (
        <div key={i} className={`bg-surface border-l-4 rounded-r-lg flex items-center justify-between p-4 shadow-panel border border-outline ${borderColor}`}>
          <div className="flex items-center gap-3">
            <div className={`${bgColor} p-2 rounded ${textColor}`}>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                campaign
              </span>
            </div>
            <div>
              <h3 className="font-label-mono text-sm text-on-background">
                Upcoming {isLeetCode ? 'LeetCode' : 'Codeforces'} Contest: {contest.title}
              </h3>
              <p className="text-xs text-on-surface-variant font-label-mono mt-0.5">
                {format(new Date(contest.scheduledAt), "dd/MM/yyyy, HH:mm:ss")}
              </p>
            </div>
          </div>
          <Link href="/contests" className={`bg-surface border px-4 py-1.5 rounded font-label-mono text-xs transition-colors shrink-0 ${btnColor}`}>
            View Contests
          </Link>
        </div>
      );
    })}
  </section>
  )}

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
  {item.type === "enrollment" ? (
    <Link
      href="/subjects"
      className="group flex items-center gap-3 p-2 rounded hover:bg-surface-container border border-transparent hover:border-outline transition-all"
    >
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary text-xl group-hover:text-primary/80 transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
          play_circle
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-body-md text-on-background text-sm group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        <p className="text-xs text-on-surface-variant font-label-mono">
          {item.subject}
        </p>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity text-sm">
        arrow_forward
      </span>
    </Link>
  ) : (
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
    </div>
  )}
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
 <Link href={`/u/${item.user.username || item.user.id}`}>
 <div className="w-8 h-8 rounded-full bg-[#F0FDF4] border border-primary/30 flex items-center justify-center text-xs font-label-mono text-primary shrink-0 uppercase hover:ring-2 hover:ring-primary/50 transition-all">
 {item.user.name.slice(0, 2)}
 </div>
 </Link>
 <div>
 <p className="text-sm text-on-background">
 <strong><Link href={`/u/${item.user.username || item.user.id}`} className="hover:underline">{item.user.name}</Link></strong> {renderFeedAction(item)}
 {" "}

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
