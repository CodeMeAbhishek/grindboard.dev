"use client";

import { useEffect, useRef, useState } from "react";
import { getLevel, getLevelProgress, getNextLevel, BADGE_DEFINITIONS } from "@/lib/gamification";
import { formatXP } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  level: string;
  xp: number;
  streak: number;
  totalSolved: number;
  cfHandle: string | null;
  lcHandle: string | null;
  earnedBadges: string[];
}

interface ProfileClientProps {
  initialUser: UserProfile;
}

export function ProfileClient({ initialUser }: ProfileClientProps) {
  const router = useRouter();
  const heatmapRef = useRef<HTMLDivElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [cfHandle, setCfHandle] = useState(initialUser.cfHandle || "");
  const [lcHandle, setLcHandle] = useState(initialUser.lcHandle || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const level = getLevel(initialUser.xp);
  const nextLevel = getNextLevel(initialUser.xp);
  const progress = getLevelProgress(initialUser.xp);

  // Generate activity heatmap
  useEffect(() => {
    if (!heatmapRef.current) return;
    const grid = heatmapRef.current;
    grid.innerHTML = "";
    for (let i = 0; i < 364; i++) {
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";
      const rand = Math.random();
      let intensity = 0;
      if (rand > 0.95) intensity = 4;
      else if (rand > 0.85) intensity = 3;
      else if (rand > 0.6) intensity = 2;
      else if (rand > 0.4) intensity = 1;
      cell.setAttribute("data-intensity", String(intensity));
      cell.title = `${intensity * 2} hours studied`;
      grid.appendChild(cell);
    }
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cfHandle: cfHandle.trim() || null,
          lcHandle: lcHandle.trim() || null,
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
      <header className="bg-white border border-[#E5E5E5] shadow-panel rounded-xl p-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-md">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] border-2 border-primary flex items-center justify-center">
              <span className="text-white text-4xl font-black font-display-xl">
                {initialUser.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white text-primary border border-primary font-label-mono text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              LVL {level.name}
            </div>
          </div>
          <div>
            <h1 className="font-display-xl text-[#1A1A1A] tracking-tighter" style={{ fontSize: "32px", lineHeight: "40px" }}>
              {initialUser.name}
            </h1>
            <p className="font-label-mono text-sm text-primary mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              {level.name}
            </p>
            {/* Level Progress */}
            <div className="mt-2 w-48">
              <div className="flex justify-between text-xs font-label-mono text-[#6B7280] mb-1">
                <span>{formatXP(initialUser.xp)} XP</span>
                <span>{nextLevel ? formatXP(nextLevel.minXP) : "MAX"}</span>
              </div>
              <div className="h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 border border-[#E5E5E5] hover:border-primary hover:text-primary text-[#6B7280] rounded px-4 py-2 font-label-mono text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
          Edit Profile
        </button>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-sm">
        {[
          { label: "Rank", value: level.name, icon: "military_tech", color: "text-primary" },
          { label: "Total XP", value: formatXP(initialUser.xp), icon: "bolt", color: "text-[#F59E0B]" },
          { label: "Streak", value: `${initialUser.streak}🔥`, icon: "local_fire_department", color: "text-[#F59E0B]" },
          { label: "Solved", value: initialUser.totalSolved, icon: "code", color: "text-[#0EA5E9]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#E5E5E5] shadow-panel p-md rounded-lg flex flex-col group relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="font-label-mono text-xs text-[#6B7280] uppercase tracking-wider mb-2">{stat.label}</span>
            <div className={`font-stat-lg ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </section>

      {/* Linked Accounts */}
      <section className="bg-white border border-[#E5E5E5] shadow-panel p-lg rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-lg-mobile text-[#1A1A1A] tracking-tight">Linked Accounts</h2>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-primary hover:bg-[#059669] text-white rounded px-4 py-1.5 font-label-mono text-sm transition-colors disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-sm ${isSyncing ? "animate-spin" : ""}`}>sync</span>
            {isSyncing ? "Syncing..." : "Sync All"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Codeforces */}
          <div className="flex items-center justify-between p-md bg-[#F9FAFB] rounded-lg border border-[#E5E5E5]">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">terminal</span>
              </div>
              <div>
                <p className="font-label-mono text-[#1A1A1A] text-sm">Codeforces</p>
                {initialUser.cfHandle ? (
                  <p className="text-xs text-primary">Synced · {initialUser.cfHandle}</p>
                ) : (
                  <p className="text-xs text-[#6B7280]">Not Linked</p>
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
          <div className="flex items-center justify-between p-md bg-[#F9FAFB] rounded-lg border border-[#E5E5E5]">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 bg-[#F3F4F6] rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6B7280]">code</span>
              </div>
              <div>
                <p className="font-label-mono text-[#1A1A1A] text-sm">LeetCode</p>
                {initialUser.lcHandle ? (
                  <p className="text-xs text-primary">Synced · {initialUser.lcHandle}</p>
                ) : (
                  <p className="text-xs text-[#6B7280]">Not Linked</p>
                )}
              </div>
            </div>
            {!initialUser.lcHandle && (
              <button onClick={() => setIsEditing(true)} className="px-4 py-1 text-xs border rounded font-label-mono bg-[#F0FDF4] text-primary border-primary/30 hover:bg-primary hover:text-white transition-colors">
                Link
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="bg-white border border-[#E5E5E5] shadow-panel p-lg rounded-xl">
        <h2 className="font-headline-lg-mobile text-[#1A1A1A] tracking-tight mb-4">Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
          {BADGE_DEFINITIONS.map((badge) => {
            const earned = initialUser.earnedBadges.includes(badge.key);
            return (
              <div
                key={badge.key}
                className={`p-md rounded-lg border flex flex-col items-center text-center gap-xs transition-all ${
                  earned
                    ? "bg-[#F9FAFB] border-primary/30"
                    : "bg-[#F9FAFB] border-[#E5E5E5] opacity-50 grayscale"
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
                  <span className="material-symbols-outlined text-lg text-[#6B7280]">lock</span>
                )}
                <p className="font-label-mono text-sm text-[#1A1A1A]">{badge.name}</p>
                <p className="text-[10px] text-[#6B7280]">{badge.description}</p>
                {earned && (
                  <span className="xp-badge text-[10px]">+{badge.xpReward} XP</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Activity Heatmap */}
      <section className="bg-white border border-[#E5E5E5] shadow-panel p-lg rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-lg-mobile text-[#1A1A1A] tracking-tight">Activity Heatmap</h2>
          <div className="flex items-center gap-2 text-[10px] font-label-mono text-[#6B7280]">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-2 h-2 rounded-sm" data-intensity={i} style={{
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
          <div className="bg-white border border-[#E5E5E5] rounded-xl w-full max-w-lg shadow-modal border-t-2 border-t-primary animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-[#E5E5E5]">
              <h2 className="font-headline-lg-mobile text-[#1A1A1A]">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-[#6B7280] hover:text-[#EF4444] transition-colors p-1">
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
                <label className="block text-sm font-label-mono text-[#1A1A1A] mb-1">Codeforces Handle</label>
                <p className="text-xs text-[#6B7280] mb-2">Your exact username on Codeforces (e.g., if your profile is codeforces.com/profile/tourist, enter <strong>tourist</strong>).</p>
                <input
                  type="text"
                  value={cfHandle}
                  onChange={(e) => setCfHandle(e.target.value)}
                  placeholder="e.g. tourist"
                  className="w-full bg-[#F9FAFB] border border-[#E5E5E5] rounded p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-label-mono text-[#1A1A1A] mb-1">LeetCode Username</label>
                <p className="text-xs text-[#6B7280] mb-2">Your exact username on LeetCode (e.g., if your profile is leetcode.com/u/neetcode, enter <strong>neetcode</strong>).</p>
                <input
                  type="text"
                  value={lcHandle}
                  onChange={(e) => setLcHandle(e.target.value)}
                  placeholder="e.g. neetcode"
                  className="w-full bg-[#F9FAFB] border border-[#E5E5E5] rounded p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
                />
              </div>

              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex gap-3 text-sm text-[#92400E]">
                <span className="material-symbols-outlined">info</span>
                <p>Linking accounts allows Grindboard to automatically track your problem-solving activities and award XP.</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F9FAFB] rounded py-3 font-label-mono transition-colors"
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
