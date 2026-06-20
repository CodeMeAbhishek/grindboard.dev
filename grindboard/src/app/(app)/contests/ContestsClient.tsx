"use client";

import { useState, useMemo } from "react";
import { formatDate } from "@/lib/utils";
import { CodeforcesIcon, LeetCodeIcon } from "@/components/icons/PlatformIcons";
import { useQuery } from "@tanstack/react-query";
import { SkeletonPage } from "@/components/skeletons";

interface Contest {
  id: string;
  title: string;
  type: string;
  time: string;
  endTime: string;
  durationMs: number;
  description: string;
  url: string;
  participants: { id: string; name: string; avatarUrl: string | null }[];
}

interface ContestsData {
  upcoming: Contest[];
  past: Contest[];
}

const TYPE_STYLES: Record<string, { badge: string; border: string; accent: string; icon: string }> = {
  CP: {
    badge: "bg-[#DBEAFE] text-[#1E40AF] border-[#3B82F6]/20",
    border: "border-t-[#3B82F6]",
    accent: "text-[#3B82F6]",
    icon: "functions"
  },
  LEETCODE: {
    badge: "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/20",
    border: "border-t-[#F59E0B]",
    accent: "text-[#F59E0B]",
    icon: "code"
  },
  GATE: {
    badge: "bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]/20",
    border: "border-t-[#EF4444]",
    accent: "text-[#EF4444]",
    icon: "school"
  },
  OTHER: {
    badge: "bg-[#F0FDF4] text-[#047857] border-primary/20",
    border: "border-t-primary",
    accent: "text-primary",
    icon: "event"
  },
};

export default function ContestsClient() {
  const [tab, setTab] = useState<"UPCOMING" | "PAST">("UPCOMING");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data, isLoading, error } = useQuery<ContestsData>({
    queryKey: ['contests'],
    queryFn: async () => {
      const res = await fetch('/api/contests');
      if (!res.ok) throw new Error('Failed to fetch contests');
      return res.json();
    }
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  // Group upcoming contests by date string (YYYY-MM-DD) for calendar
  const contestsByDate = useMemo(() => {
    const map: Record<string, Contest[]> = {};
    if (data?.upcoming) {
      data.upcoming.forEach(c => {
        const dateStr = new Date(c.time).toISOString().split("T")[0];
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(c);
      });
    }
    return map;
  }, [data?.upcoming]);

  if (isLoading) {
    return <SkeletonPage />;
  }

  if (error || !data) {
    return <div className="p-8 text-red-500 text-center">Failed to load contests.</div>;
  }

  const { upcoming, past } = data;

  const renderCalendar = () => {
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="bg-surface border border-outline rounded-xl p-6 shadow-panel mt-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display-md text-xl font-bold text-on-background">{monthName} {year}</h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 border border-outline rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-background">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button onClick={nextMonth} className="p-2 border border-outline rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-background">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-outline rounded-lg overflow-hidden border border-outline">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-surface-container py-2 text-center text-xs font-label-mono font-bold text-on-surface-variant">
              {day}
            </div>
          ))}
          
          {blanks.map(b => (
            <div key={`blank-${b}`} className="bg-surface min-h-[100px] p-2 opacity-50"></div>
          ))}
          
          {days.map(d => {
            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
            // fix timezone offset to match the format used for map keys
            const tzOffset = dateObj.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, -1);
            const dateStr = localISOTime.split("T")[0];
            const dayContests = contestsByDate[dateStr] || [];
            
            return (
              <div key={`day-${d}`} className="bg-surface min-h-[100px] p-2 border-t border-outline flex flex-col relative transition-colors hover:bg-surface-container/30">
                <span className="text-sm font-label-mono font-medium text-on-surface-variant mb-1">{d}</span>
                <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                  {dayContests.map(c => {
                    const style = TYPE_STYLES[c.type] || TYPE_STYLES.OTHER;
                    return (
                      <a 
                        key={c.id} 
                        href={c.url.startsWith('http') ? c.url : `https://${c.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[10px] p-1 rounded truncate border ${style.badge} font-medium flex items-center gap-1 hover:opacity-80`}
                        title={c.title}
                      >
                        {c.type === 'CP' && <CodeforcesIcon className="w-4 h-4" />}
                        {c.type === 'LEETCODE' && <LeetCodeIcon className="w-4 h-4" />}
                        {c.type === 'CP' ? 'CF' : c.type === 'LEETCODE' ? 'LC' : c.type}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 pt-4 animate-fade-in">
      <header className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="font-display-lg text-3xl font-black tracking-tight text-on-background">
            Contest Radar
          </h1>
          <p className="text-on-surface-variant font-label-mono mt-2">
            Track, prepare, and dominate your upcoming scheduled contests.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-1">Today</span>
          <span className="text-sm font-bold text-on-background bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline shadow-sm">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-surface-container-low p-1 rounded-lg w-fit border border-outline">
        <button
          onClick={() => setTab("UPCOMING")}
          className={`px-4 py-2 rounded-md font-label-mono text-sm capitalize transition-all ${
            tab === "UPCOMING"
              ? "bg-surface text-on-background shadow-sm"
              : "text-on-surface-variant hover:text-on-background"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("PAST")}
          className={`px-4 py-2 rounded-md font-label-mono text-sm capitalize transition-all ${
            tab === "PAST"
              ? "bg-surface text-on-background shadow-sm"
              : "text-on-surface-variant hover:text-on-background"
          }`}
        >
          Past Contests
        </button>
      </div>

      {tab === "UPCOMING" ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 bg-surface border border-outline rounded-xl border-dashed">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 opacity-50">event_busy</span>
              <p className="text-on-surface-variant font-label-mono">No upcoming contests found.</p>
              <p className="text-xs text-on-surface-variant/70 mt-1">Check back later or ensure the cron has run.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((contest) => {
                const style = TYPE_STYLES[contest.type] || TYPE_STYLES.OTHER;
                const isLive = new Date(contest.time).getTime() <= Date.now() && new Date(contest.endTime).getTime() > Date.now();
                const msUntilStart = new Date(contest.time).getTime() - Date.now();
                
                let relativeTimeStr = "";
                if (isLive) {
                  relativeTimeStr = "Live Now";
                } else {
                  const hoursUntil = msUntilStart / (1000 * 60 * 60);
                  if (hoursUntil < 24) {
                    if (hoursUntil < 1) relativeTimeStr = `Starts in ${Math.round(msUntilStart / 60000)} mins`;
                    else relativeTimeStr = `Starts in ${Math.round(hoursUntil)} hrs`;
                  } else {
                    relativeTimeStr = `Starts in ${Math.round(hoursUntil / 24)} days`;
                  }
                }

                return (
                  <div key={contest.id} className={`bg-surface rounded-xl p-5 border shadow-sm flex flex-col ${isLive ? 'border-[#EF4444] shadow-md relative overflow-hidden' : style.border}`}>
                    {isLive && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EF4444] to-transparent animate-pulse" />
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <div className={`px-2 py-0.5 rounded text-xs font-label-mono font-medium border ${style.badge} flex items-center gap-1.5`}>
                        {contest.type === 'CP' ? (
                          <CodeforcesIcon className="w-4 h-4" />
                        ) : contest.type === 'LEETCODE' ? (
                          <LeetCodeIcon className="w-4 h-4" />
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">{style.icon}</span>
                        )}
                        {contest.type === 'CP' ? 'Codeforces' : contest.type === 'LEETCODE' ? 'LeetCode' : contest.type}
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-label-mono text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                          {new Date(contest.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {isLive ? (
                          <span className="text-[10px] font-bold text-[#EF4444] flex items-center gap-1 uppercase tracking-wider bg-[#FEE2E2] px-1.5 py-0.5 rounded border border-[#EF4444]/20 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span> LIVE
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-on-surface-variant/70 uppercase tracking-wider">
                            {relativeTimeStr}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-on-background text-lg leading-tight mb-2 line-clamp-2">
                      {contest.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs font-label-mono text-on-surface-variant mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {new Date(contest.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">timer</span>
                        {contest.description.split("Duration: ")[1] || "N/A"}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-outline flex justify-between items-center">
                      <p className="text-xs text-on-surface-variant italic truncate max-w-[60%]">
                        {contest.description.split(" -")[0]}
                      </p>
                      <a 
                        href={contest.url.startsWith('http') ? contest.url : `https://${contest.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                      >
                        Participate <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Calendar View */}
          {renderCalendar()}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-surface border border-outline rounded-xl shadow-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline text-xs font-label-mono text-on-surface-variant uppercase tracking-wider">
                    <th className="p-4 font-medium">Contest</th>
                    <th className="p-4 font-medium">Platform</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Participants</th>
                    <th className="p-4 font-medium text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {past.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant font-label-mono">
                        No past contests found.
                      </td>
                    </tr>
                  ) : (
                    past.map((contest) => {
                      const style = TYPE_STYLES[contest.type] || TYPE_STYLES.OTHER;
                      return (
                        <tr key={contest.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="p-4">
                            <p className="text-sm font-medium text-on-background">{contest.title}</p>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-label-mono font-medium border ${style.badge}`}>
                              {contest.type === 'CP' ? 'Codeforces' : contest.type === 'LEETCODE' ? 'LeetCode' : contest.type}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-label-mono text-on-surface-variant">
                            {formatDate(contest.time)}
                          </td>
                          <td className="p-4">
                            {contest.participants && contest.participants.length > 0 ? (
                              <div className="flex -space-x-2 overflow-hidden">
                                {contest.participants.slice(0, 3).map((p) => (
                                  <img
                                    key={p.id}
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-surface object-cover bg-surface-container-high"
                                    src={p.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`}
                                    alt={p.name}
                                    title={p.name}
                                  />
                                ))}
                                {contest.participants.length > 3 && (
                                  <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-surface bg-surface-container-high text-[10px] font-bold text-on-surface-variant z-10" title={`+${contest.participants.length - 3} others`}>
                                    +{contest.participants.length - 3}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-on-surface-variant italic">None</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <a 
                              href={contest.url.startsWith('http') ? contest.url : `https://${contest.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium"
                            >
                              View <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
