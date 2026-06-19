"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { getSkillLevel, BADGE_DEFINITIONS } from "@/lib/gamification";
import { formatXP } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CodeforcesIcon, LeetCodeIcon, LinkedInIcon } from "@/components/icons/PlatformIcons";

interface UserProfile {
 name: string;
 username: string;
 level: string;
 xp: number;
 streak: number;
 cfSolved: number;
 lcSolved: number;
 cfHandle: string | null;
 lcHandle: string | null;
 linkedin: string | null;
  cfRating?: number | null;
  cfMaxRating?: number | null;
  cfRank?: string | null;
  lcRating?: number | null;
  lcGlobalRanking?: number | null;
  lcBadge?: string | null;
  earnedBadges: string[];
  recentActivities?: Array<{
    id: string;
    type: "LEETCODE" | "CODEFORCES";
    lcProblemName: string | null;
    lcDifficulty: "EASY" | "MEDIUM" | "HARD" | null;
    cfContestId: number | null;
    metadata: any;
    notes: string | null;
    externalId: string | null;
    xpEarned: number;
    createdAt: string;
  }>;
  activityCounts: Record<string, number>;
}

interface ProfileClientProps {
 initialUser: UserProfile;
}

export function ProfileClient({ initialUser }: ProfileClientProps) {
 const router = useRouter();
 const heatmapRef = useRef<HTMLDivElement>(null);
 
 const [isEditing, setIsEditing] = useState(false);
 const [name, setName] = useState(initialUser.name || "");
 const [cfHandle, setCfHandle] = useState(initialUser.cfHandle || "");
 const [lcHandle, setLcHandle] = useState(initialUser.lcHandle || "");
 const [linkedin, setLinkedin] = useState(initialUser.linkedin || "");
 const [isSaving, setIsSaving] = useState(false);
 const [isSyncing, setIsSyncing] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");
 const [selectedYear, setSelectedYear] = useState<string>("Past Year");

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    Object.keys(initialUser.activityCounts).forEach(date => {
      years.add(date.substring(0, 4));
    });
    // Ensure current year is always there
    years.add(new Date().getFullYear().toString());
    return ["Past Year", ...Array.from(years).sort().reverse()];
  }, [initialUser.activityCounts]);

  const level = getSkillLevel(initialUser.cfRating, initialUser.lcRating);

  // Generate activity heatmap using real data
  useEffect(() => {
    if (!heatmapRef.current) return;
    const grid = heatmapRef.current;
    grid.innerHTML = "";
    
    let startDate: Date;
    let numDays: number;
    
    if (selectedYear === "Past Year") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 364); // 365 days
      numDays = 365;
    } else {
      const year = parseInt(selectedYear);
      startDate = new Date(year, 0, 1);
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      numDays = isLeap ? 366 : 365;
    }

    // Pad the start so the cells align with days of the week
    const startDayOfWeek = startDate.getDay(); // 0 is Sunday
    for (let i = 0; i < startDayOfWeek; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.style.width = "10px";
      emptyCell.style.height = "10px";
      grid.appendChild(emptyCell);
    }
    
    for (let i = 0; i < numDays; i++) {
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";
      
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      const count = initialUser.activityCounts[dateStr] || 0;
      
      let intensity = 0;
      if (count >= 5) intensity = 4;
      else if (count >= 3) intensity = 3;
      else if (count >= 2) intensity = 2;
      else if (count >= 1) intensity = 1;
      
      cell.setAttribute("data-intensity", String(intensity));
      cell.title = count > 0 
        ? `${count} problem${count > 1 ? 's' : ''} solved on ${date.toDateString()}` 
        : `No activity on ${date.toDateString()}`;
        
      grid.appendChild(cell);
    }
  }, [initialUser.activityCounts, selectedYear]);

 const handleSaveProfile = async () => {
 setIsSaving(true);
 try {
 const res = await fetch("/api/profile/update", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 name: name.trim() || undefined,
 cfHandle: cfHandle.trim() || null,
 lcHandle: lcHandle.trim() || null,
 linkedin: linkedin.trim() || null,
 }),
 });
 if (res.ok) {
 setIsEditing(false);
 setErrorMsg("");
 router.refresh();
 } else {
 const errData = await res.json();
 setErrorMsg(errData.error || "Failed to save profile. Please check your handles.");
 }
 } catch (err) {
 console.error(err);
 setErrorMsg("An unexpected error occurred. Please try again.");
 } finally {
 setIsSaving(false);
 }
 };

 const handleSync = async () => {
 if (!initialUser.cfHandle && !initialUser.lcHandle) {
 alert("Please link your Codeforces or LeetCode account first by editing your profile.");
 return;
 }
 setIsSyncing(true);
 try {
 const res = await fetch("/api/sync", { method: "POST" });
 const data = await res.json();
 if (res.ok) {
 alert(`Synced successfully! New activities: ${data.newActivities}, XP Gained: ${data.xpGained}`);
 router.refresh();
 } else {
 alert("Sync failed: " + data.error);
 }
 } catch (err) {
 console.error(err);
 alert("Failed to sync data.");
 } finally {
 setIsSyncing(false);
 }
 };

 return (
 <div className="max-w-4xl mx-auto space-y-6">
 {/* Profile Header */}
 <header className="bg-surface border border-outline shadow-panel rounded-xl p-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div className="flex items-center gap-md">
 <div className="relative">
 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] border-2 border-primary flex items-center justify-center">
 <span className="text-white text-4xl font-black font-display-xl">
 {initialUser.name.split(" ").map((n) => n[0]).join("")}
 </span>
 </div>
 <div className="absolute -bottom-2 -right-2 bg-surface text-primary border border-primary font-label-mono text-[10px] px-2 py-0.5 rounded-full shadow-sm">
 LVL {level.name}
 </div>
 </div>
 <div>
 <h1 className="font-display-xl text-on-background tracking-tighter" style={{ fontSize: "32px", lineHeight: "40px" }}>
 {initialUser.name}
 </h1>
 {initialUser.username && (
 <p className="font-label-mono text-on-surface-variant text-sm mt-0.5">
 @{initialUser.username}
 </p>
 )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <p className="font-label-mono text-sm text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  {level.name}
                </p>
                {initialUser.cfHandle && (
                  <div className="flex items-center gap-1.5 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-1.5 py-0.5 rounded w-fit font-label-mono text-xs">
                    <CodeforcesIcon className="w-3.5 h-3.5" />
                    <span className="capitalize">{initialUser.cfRank || 'Unrated'}</span>
                    {!!initialUser.cfRating && <span className="opacity-80">({initialUser.cfRating})</span>}
                  </div>
                )}
                {initialUser.lcHandle && (
                  <div className="flex items-center gap-1.5 bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 px-1.5 py-0.5 rounded w-fit font-label-mono text-xs">
                    <LeetCodeIcon className="w-3.5 h-3.5" />
                    <span className="capitalize">{initialUser.lcBadge || 'Unranked'}</span>
                    {!!initialUser.lcRating && <span className="opacity-80">({Math.round(initialUser.lcRating)})</span>}
                  </div>
                )}
              </div>
 </div>
 </div>
 <button 
 onClick={() => setIsEditing(true)}
 className="flex items-center gap-2 border border-outline hover:border-primary hover:text-primary text-on-surface-variant rounded px-4 py-2 font-label-mono text-sm transition-colors"
 >
 <span className="material-symbols-outlined text-lg">edit</span>
 Edit Profile
 </button>
 </header>

 {/* Stats Row */}
 <section className="grid grid-cols-2 md:grid-cols-4 gap-sm">
 {[
 { label: "Rank", value: level.name, icon: "military_tech", color: "text-primary" },
 { label: "Streak", value: `${initialUser.streak}🔥`, icon: "local_fire_department", color: "text-[#F59E0B]" },
 { 
    label: "Solved", 
    value: (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="Codeforces Solved">
          <CodeforcesIcon className="w-5 h-5 text-on-surface-variant" />
          <span className="text-[#0EA5E9]">{initialUser.cfSolved || 0}</span>
        </div>
        <div className="flex items-center gap-1.5" title="LeetCode Solved">
          <LeetCodeIcon className="w-5 h-5 text-on-surface-variant" />
          <span className="text-[#0EA5E9]">{initialUser.lcSolved || 0}</span>
        </div>
      </div>
    ), 
    icon: "code", 
    color: "text-[#0EA5E9]" 
  },
 ].map((stat) => (
 <div key={stat.label} className="bg-surface border border-outline shadow-panel p-md rounded-lg flex flex-col group relative overflow-hidden">
 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
 <span className="font-label-mono text-xs text-on-surface-variant uppercase tracking-wider mb-2">{stat.label}</span>
 <div className={`font-stat-lg ${stat.color}`}>{stat.value}</div>
 </div>
 ))}
 </section>

 {/* Linked Accounts */}
 <section className="bg-surface border border-outline shadow-panel p-lg rounded-xl">
 <div className="flex justify-between items-center mb-4">
 <h2 className="font-headline-lg-mobile text-on-background tracking-tight">Linked Accounts</h2>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container px-3 py-1.5 rounded border border-outline">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          Auto-syncs hourly for fairness
        </div>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
 {/* Codeforces */}
 <div className="flex items-center justify-between p-md bg-surface-container rounded-lg border border-outline">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-transparent">
                <CodeforcesIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="font-label-mono text-on-background text-sm">Codeforces</p>
                {initialUser.cfHandle ? (
                  <div className="flex flex-col">
                    <a 
                      href={`https://codeforces.com/profile/${initialUser.cfHandle}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline hover:text-primary-hover transition-colors"
                    >
                      Synced · {initialUser.cfHandle}
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant">Not Linked</p>
                )}
              </div>
            </div>
 {!initialUser.cfHandle && (
 <button onClick={() => setIsEditing(true)} className="px-4 py-1 text-xs border rounded font-label-mono bg-[#F0FDF4] text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors">
 Link
 </button>
 )}
 </div>
 {/* LeetCode */}
 <div className="flex items-center justify-between p-md bg-surface-container rounded-lg border border-outline">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-transparent">
                <LeetCodeIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="font-label-mono text-on-background text-sm">LeetCode</p>
                {initialUser.lcHandle ? (
                  <div className="flex flex-col">
                    <a 
                      href={`https://leetcode.com/u/${initialUser.lcHandle}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline hover:text-primary-hover transition-colors"
                    >
                      Synced · {initialUser.lcHandle}
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant">Not Linked</p>
                )}
              </div>
            </div>
 {!initialUser.lcHandle && (
 <button onClick={() => setIsEditing(true)} className="px-4 py-1 text-xs border rounded font-label-mono bg-[#F0FDF4] text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors">
 Link
 </button>
 )}
 </div>
 {/* LinkedIn */}
 <div className="flex items-center justify-between p-md bg-surface-container rounded-lg border border-outline">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-transparent">
                <LinkedInIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="font-label-mono text-on-background text-sm">LinkedIn</p>
                {initialUser.linkedin ? (
                  <a 
                    href={`https://linkedin.com/in/${initialUser.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline hover:text-primary-hover transition-colors"
                  >
                    Linked · {initialUser.linkedin}
                  </a>
                ) : (
                  <p className="text-xs text-on-surface-variant">Not Linked</p>
                )}
              </div>
            </div>
 {!initialUser.linkedin && (
 <button onClick={() => setIsEditing(true)} className="px-4 py-1 text-xs border rounded font-label-mono bg-[#F0FDF4] text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors">
 Link
 </button>
 )}
 </div>
 </div>
 </section>

    {/* Recent Activity */}
    {initialUser.recentActivities && initialUser.recentActivities.length > 0 && (
      <section className="bg-surface border border-outline shadow-panel p-lg rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-lg-mobile text-on-background tracking-tight">Recent Activity</h2>
          <button 
            onClick={() => router.push("/history")}
            className="text-xs font-label-mono text-primary hover:text-primary-hover hover:underline"
          >
            View All
          </button>
        </div>
        <div className="flex flex-col gap-0">
          {initialUser.recentActivities.map(activity => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b border-outline last:border-b-0">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-surface-container shrink-0">
                  {activity.type === "LEETCODE" ? <LeetCodeIcon className="w-5 h-5" /> : <CodeforcesIcon className="w-5 h-5" />}
                </div>
                <div>
                  <a 
                    href={activity.type === "LEETCODE" 
                      ? `https://leetcode.com/problems/${activity.lcProblemName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                      : activity.cfContestId 
                        ? (activity.metadata as any)?.index 
                          ? `https://codeforces.com/contest/${activity.cfContestId}/problem/${(activity.metadata as any).index}`
                          : `https://codeforces.com/contest/${activity.cfContestId}`
                        : `https://codeforces.com/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-on-background font-medium line-clamp-1 hover:text-primary hover:underline transition-colors"
                  >
                    {activity.type === "LEETCODE" 
                      ? activity.lcProblemName 
                      : activity.notes || `Codeforces Problem`}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    {activity.type === "LEETCODE" && activity.lcDifficulty && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-label-mono uppercase ${
                        activity.lcDifficulty === 'EASY' ? 'bg-[#10B981]/10 text-[#10B981]' :
                        activity.lcDifficulty === 'MEDIUM' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {activity.lcDifficulty}
                      </span>
                    )}
                    {activity.type === "CODEFORCES" && (activity.metadata as any)?.rating && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-label-mono bg-primary/10 text-primary">
                        Rating {(activity.metadata as any).rating}
                      </span>
                    )}
                    <span className="text-xs text-on-surface-variant" suppressHydrationWarning>
                      {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="font-label-mono text-sm text-primary font-bold whitespace-nowrap">
                +{activity.xpEarned} XP
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

 {/* Badges */}
 <section className="bg-surface border border-outline shadow-panel p-lg rounded-xl">
 <h2 className="font-headline-lg-mobile text-on-background tracking-tight mb-4">Badges</h2>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
 {BADGE_DEFINITIONS.map((badge) => {
 const earned = initialUser.earnedBadges.includes(badge.key);
 return (
 <div
 key={badge.key}
 className={`p-md rounded-lg border flex flex-col items-center text-center gap-xs transition-all ${
 earned
 ? "bg-surface-container border-primary/30"
 : "bg-surface-container border-outline opacity-50 grayscale"
 }`}
 >
 <span
 className="material-symbols-outlined text-5xl"
 style={{
 color: earned ? "#10B981" : "#6B7280",
 fontVariationSettings: earned ? "'FILL' 1" : "'FILL' 0",
 }}
 >
 {badge.icon}
 </span>
 {!earned && (
 <span className="material-symbols-outlined text-lg text-on-surface-variant">lock</span>
 )}
 <p className="font-label-mono text-sm text-on-background">{badge.name}</p>
 <p className="text-[10px] text-on-surface-variant">{badge.description}</p>
 {earned && (
 <span className="xp-badge text-[10px]">+{badge.xpReward} XP</span>
 )}
 </div>
 );
 })}
 </div>
 </section>

  {/* Activity Heatmap */}
  <section className="bg-surface border border-outline shadow-panel p-lg rounded-xl">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <h2 className="font-headline-lg-mobile text-on-background tracking-tight">Activity Heatmap</h2>
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-surface-container border border-outline rounded px-2 py-1 text-xs font-label-mono text-on-surface-variant focus:outline-none focus:border-primary"
        >
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-label-mono text-on-surface-variant">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-sm" data-intensity={i} style={{
            backgroundColor: i === 0 ? "#E5E5E5" : `rgba(16,185,129,${i * 0.25})`
          }} />
        ))}
        <span>More</span>
      </div>
    </div>
 <div className="overflow-x-auto">
 <div
 ref={heatmapRef}
 className="grid grid-flow-col gap-1 min-w-[600px]"
 style={{ gridTemplateRows: "repeat(7, 10px)" }}
 />
 </div>
 </section>

 {/* Edit Profile Modal */}
 {isEditing && (
 <div 
 className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-fade-in"
 onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}
 >
 <div className="bg-surface border border-outline rounded-xl w-full max-w-lg shadow-modal border-t-2 border-t-primary animate-slide-up">
 <div className="flex justify-between items-center p-6 border-b border-outline">
 <h2 className="font-headline-lg-mobile text-on-background">Edit Profile</h2>
 <button onClick={() => setIsEditing(false)} className="text-on-surface-variant hover:text-[#EF4444] transition-colors p-1">
 <span className="material-symbols-outlined">close</span>
 </button>
 </div>
 
 <div className="p-6 space-y-6">
 {errorMsg && (
 <div className="bg-[#FEF2F2] border border-[#F87171] rounded-lg p-3 flex gap-2 text-sm text-[#991B1B]">
 <span className="material-symbols-outlined text-[20px]">error</span>
 <p>{errorMsg}</p>
 </div>
 )}
 
 <div>
 <label className="block text-sm font-label-mono text-on-background mb-1">Display Name</label>
 <p className="text-xs text-on-surface-variant mb-2">The name that will be displayed on your profile and leaderboards.</p>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="e.g. John Doe"
 className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
 />
 </div>

 <div>
 <label className="block text-sm font-label-mono text-on-background mb-1">Codeforces Handle</label>
 <p className="text-xs text-on-surface-variant mb-2">Your exact username on Codeforces (e.g., if your profile is codeforces.com/profile/tourist, enter <strong>tourist</strong>).</p>
 <input
 type="text"
 value={cfHandle}
 onChange={(e) => setCfHandle(e.target.value)}
 placeholder="e.g. tourist"
 className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
 />
 </div>

 <div>
 <label className="block text-sm font-label-mono text-on-background mb-1">LeetCode Username</label>
 <p className="text-xs text-on-surface-variant mb-2">Your exact username on LeetCode (e.g., if your profile is leetcode.com/u/neetcode, enter <strong>neetcode</strong>).</p>
 <input
 type="text"
 value={lcHandle}
 onChange={(e) => setLcHandle(e.target.value)}
 placeholder="e.g. neetcode"
 className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
 />
 </div>

 <div>
 <label className="block text-sm font-label-mono text-on-background mb-1">LinkedIn Username</label>
 <p className="text-xs text-on-surface-variant mb-2">Your exact username on LinkedIn (e.g., if your profile is linkedin.com/in/johndoe, enter <strong>johndoe</strong>).</p>
 <input
 type="text"
 value={linkedin}
 onChange={(e) => setLinkedin(e.target.value)}
 placeholder="e.g. johndoe"
 className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
 />
 </div>

 <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex gap-3 text-sm text-[#92400E]">
 <span className="material-symbols-outlined">info</span>
 <p>Linking accounts allows Grindboard to automatically track your problem-solving activities and award XP.</p>
 </div>

 <div className="flex gap-4 pt-4 border-t border-outline">
 <button
 type="button"
 onClick={() => setIsEditing(false)}
 className="flex-1 bg-surface border border-outline text-on-background hover:bg-surface-container rounded py-3 font-label-mono transition-colors"
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={handleSaveProfile}
 disabled={isSaving}
 className="flex-1 bg-primary text-white hover:bg-[#059669] rounded py-3 font-label-mono shadow-sm transition-all disabled:opacity-50"
 >
 {isSaving ? "Saving..." : "Save Changes"}
 </button>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
