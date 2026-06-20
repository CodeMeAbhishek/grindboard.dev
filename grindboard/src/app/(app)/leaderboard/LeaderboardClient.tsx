"use client";

import { useState } from "react";
import Link from "next/link";
import { CodeforcesIcon, LeetCodeIcon } from "@/components/icons/PlatformIcons";

interface LeaderUser {
  id: string;
  username: string | null;
  name: string;
  avatarUrl: string | null;
  cfHandle: string | null;
  lcHandle: string | null;
  cfRating: number;
  cfRank: string | null;
  lcRating: number;
  lcGlobalRanking: number | null;
  lcBadge: string | null;
  isCurrentUser: boolean;
}

interface LeaderboardClientProps {
  initialData: LeaderUser[];
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-full bg-[#FEF9C3] border border-[#F59E0B]/30 flex items-center justify-center">
      <span className="material-symbols-outlined text-[#F59E0B] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        emoji_events
      </span>
    </div>
  );
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-full bg-surface-container-high border border-[#6B7280]/30 flex items-center justify-center">
      <span className="material-symbols-outlined text-on-surface-variant text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
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
    <div className="w-8 h-8 rounded-full bg-surface-container border border-outline flex items-center justify-center font-label-mono text-sm text-on-surface-variant">
      {rank}
    </div>
  );
}

export function LeaderboardClient({ initialData }: LeaderboardClientProps) {
  const [tab, setTab] = useState<"CODEFORCES" | "LEETCODE">("CODEFORCES");

  // Filter and sort based on active tab
  const activeData = [...initialData]
    .filter(u => tab === "CODEFORCES" ? u.cfHandle : u.lcHandle)
    .sort((a, b) => {
      if (tab === "CODEFORCES") return b.cfRating - a.cfRating;
      return b.lcRating - a.lcRating;
    })
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const currentUser = activeData.find((u) => u.isCurrentUser);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-background tracking-tight">
            Leaderboard
          </h1>
          <p className="text-on-surface-variant mt-0.5">Global Rankings (Updates every 6 hrs)</p>
        </div>
        <div className="flex bg-surface-container-high p-1 rounded-lg border border-outline shadow-panel">
          <button
            onClick={() => setTab("CODEFORCES")}
            className={`px-4 py-1.5 rounded-md font-label-mono text-sm capitalize transition-all flex items-center gap-2 ${
              tab === "CODEFORCES" ? "bg-surface shadow-sm text-primary" : "text-on-surface-variant hover:text-on-background"
            }`}
          >
            <CodeforcesIcon className="w-5 h-5" />
            Codeforces
          </button>
          <button
            onClick={() => setTab("LEETCODE")}
            className={`px-4 py-1.5 rounded-md font-label-mono text-sm capitalize transition-all flex items-center gap-2 ${
              tab === "LEETCODE" ? "bg-surface shadow-sm text-primary" : "text-on-surface-variant hover:text-on-background"
            }`}
          >
            <LeetCodeIcon className="w-5 h-5" />
            LeetCode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface border border-outline rounded-xl overflow-hidden shadow-panel">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline bg-surface-container-low text-on-surface-variant text-xs font-label-mono uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Rank</th>
                    <th className="px-4 py-3 font-medium">Competitor</th>
                    <th className="px-4 py-3 font-medium text-right">Rating</th>
                    <th className="px-4 py-3 font-medium text-right hidden sm:table-cell">Tier / Global Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {activeData.map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-surface-container-low transition-colors ${
                        user.isCurrentUser ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <RankBadge rank={user.rank} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Link href={`/u/${user.username || user.id}`} className="hover:ring-2 hover:ring-primary/50 rounded-full transition-all block">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-outline" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {user.name[0]}
                              </div>
                            )}
                          </Link>
                          <div className="flex flex-col">
                            <Link href={`/u/${user.username || user.id}`} className={`font-medium hover:underline ${user.isCurrentUser ? "text-primary" : "text-on-background"}`}>
                              {user.name}
                            </Link>
                            <span className="text-xs text-on-surface-variant font-label-mono">
                              {user.username ? `@${user.username}` : "Member"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="font-label-mono font-bold text-on-background">
                          {tab === "CODEFORCES" ? user.cfRating : user.lcRating}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right hidden sm:table-cell">
                        {tab === "CODEFORCES" ? (
                          user.cfRank ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-label-mono font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                              {user.cfRank}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-label-mono font-medium capitalize bg-surface-container-high text-on-surface-variant border border-outline">
                              Unrated
                            </span>
                          )
                        ) : (
                          <div className="flex flex-col items-end">
                            {user.lcBadge ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-label-mono font-medium capitalize bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">
                                {user.lcBadge}
                              </span>
                            ) : !user.lcGlobalRanking ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-label-mono font-medium capitalize bg-surface-container-high text-on-surface-variant border border-outline">
                                Unrated
                              </span>
                            ) : null}
                            {user.lcGlobalRanking && (
                              <span className="text-xs text-on-surface-variant font-label-mono mt-1">
                                Global: #{user.lcGlobalRanking.toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {activeData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-on-surface-variant font-label-mono">
                        No competitors found for {tab === "CODEFORCES" ? "Codeforces" : "LeetCode"}. Add your handle in Profile!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar / Me */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface border border-primary/20 rounded-xl p-5 shadow-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            
            <h3 className="font-label-mono text-xs text-on-surface-variant uppercase tracking-wider mb-4">
              Your Standing
            </h3>
            
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline flex items-center justify-center flex-col shadow-sm relative z-10">
                  <span className="text-xs font-label-mono text-on-surface-variant mb-0.5">RANK</span>
                  <span className="font-headline-sm font-bold text-primary leading-none">#{currentUser.rank}</span>
                </div>
                
                <div className="flex-1">
                  <Link href={`/u/${currentUser.username || currentUser.id}`} className="font-bold text-on-background text-lg hover:underline">{currentUser.name}</Link>
                  <div className="text-on-surface-variant text-sm flex items-center gap-1.5 mt-1">
                    <span className="font-label-mono font-medium text-on-background">
                      {tab === "CODEFORCES" ? currentUser.cfRating : currentUser.lcRating}
                    </span>
                    <span>Rating</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-on-surface-variant mb-3">
                  You haven't linked your {tab === "CODEFORCES" ? "Codeforces" : "LeetCode"} account yet.
                </p>
                <a href="/profile" className="inline-block bg-primary text-white font-label-mono text-sm px-4 py-2 rounded hover:bg-[#059669] transition-colors">
                  Link Account
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
