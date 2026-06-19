"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

export type EventType = "CP" | "LEETCODE" | "GATE" | "OTHER";

export interface UpcomingEvent {
  id: string;
  title: string;
  type: string;
  platform: string;
  time: string;
  description: string;
  participants?: string;
  duration?: string;
  url: string;
}

export interface PastEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  yourRank: string;
  yourScore: string;
  xpEarned: number;
  leaderboard: { rank: string; name: string; score: string }[];
}

interface EventsClientProps {
  initialUpcoming: UpcomingEvent[];
  initialPast: PastEvent[];
}

const TYPE_STYLES: Record<string, { badge: string; border: string; accent: string; text: string }> = {
  CP: {
    badge: "bg-[#DBEAFE] text-[#1E40AF] border-[#3B82F6]/20",
    border: "border-t-[#3B82F6]",
    accent: "text-[#3B82F6]",
    text: "CP",
  },
  LEETCODE: {
    badge: "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/20",
    border: "border-t-[#F59E0B]",
    accent: "text-[#F59E0B]",
    text: "LeetCode",
  },
  GATE: {
    badge: "bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]/20",
    border: "border-t-[#EF4444]",
    accent: "text-[#EF4444]",
    text: "GATE",
  },
  OTHER: {
    badge: "bg-[#F0FDF4] text-[#047857] border-primary/20",
    border: "border-t-primary",
    accent: "text-primary",
    text: "Other",
  },
};

function LogResultModal({ onClose }: { onClose: () => void }) {
  const [rank, setRank] = useState("");
  const [solved, setSolved] = useState("");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-[#E5E5E5] rounded-xl w-full max-w-md shadow-modal animate-slide-up">
        <div className="flex justify-between items-center p-md border-b border-[#E5E5E5]">
          <h3 className="font-headline-lg-mobile text-[#1A1A1A]">Log Event Result</h3>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#EF4444] transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-md space-y-4">
          <div>
            <label className="block font-label-mono text-[12px] text-[#6B7280] uppercase mb-1.5">Global Rank</label>
            <input type="number" value={rank} onChange={(e) => setRank(e.target.value)} className="input-base" placeholder="e.g. 1200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-mono text-[12px] text-[#6B7280] uppercase mb-1.5">Problems Solved / Score</label>
              <input type="text" value={solved} onChange={(e) => setSolved(e.target.value)} className="input-base" />
            </div>
            <div>
              <label className="block font-label-mono text-[12px] text-[#6B7280] uppercase mb-1.5">Rating Change</label>
              <input type="text" value={rating} onChange={(e) => setRating(e.target.value)} className="input-base" placeholder="+/- 50" />
            </div>
          </div>
          <div>
            <label className="block font-label-mono text-[12px] text-[#6B7280] uppercase mb-1.5">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input-base h-20 resize-none" placeholder="Key takeaways..." />
          </div>
          <div className="flex gap-3 pt-2 border-t border-[#E5E5E5]">
            <button onClick={onClose} className="flex-1 py-2 border border-[#E5E5E5] text-[#6B7280] rounded font-label-mono text-sm hover:bg-[#FAFAFA] transition-colors">
              Cancel
            </button>
            <button onClick={onClose} className="flex-1 bg-primary text-white py-2 rounded font-label-mono text-sm hover:bg-[#059669] transition-colors font-bold">
              Submit Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventsClient({ initialUpcoming, initialPast }: EventsClientProps) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [showLogModal, setShowLogModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-[#1A1A1A] tracking-tight">
            Competition Radar
          </h1>
          <p className="text-[#6B7280] mt-0.5">Track, prepare, and dominate your scheduled events.</p>
        </div>
        <div className="flex bg-[#F3F4F6] p-1 rounded-lg border border-[#E5E5E5] w-full sm:w-auto shadow-panel">
          <button
            onClick={() => setTab("upcoming")}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-label-mono text-sm transition-all ${
              tab === "upcoming" ? "tab-active" : "tab-inactive"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab("past")}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-label-mono text-sm transition-all ${
              tab === "past" ? "tab-active" : "tab-inactive"
            }`}
          >
            Past Results
          </button>
        </div>
      </div>

      {/* Upcoming Tab */}
      {tab === "upcoming" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {initialUpcoming.length === 0 ? (
             <div className="col-span-full text-center py-12 text-[#6B7280] font-label-mono text-sm">
               No upcoming events found.
             </div>
          ) : initialUpcoming.map((event) => {
            const style = TYPE_STYLES[event.type] || TYPE_STYLES["OTHER"];
            return (
              <div
                key={event.id}
                className={`bg-white border border-[#E5E5E5] rounded-xl p-md flex flex-col shadow-panel group relative overflow-hidden border-t-4 ${style.border}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-mono text-xs border ${style.badge}`}>
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "currentColor" }} />
                    {style.text}
                  </span>
                  <div className="text-right">
                    <span className={`block font-label-mono text-sm ${style.accent}`}>{formatDate(new Date(event.time))}</span>
                    <span className="text-[12px] text-[#6B7280]">{event.platform}</span>
                  </div>
                </div>
                <h3 className="font-stat-lg text-[#1A1A1A] mb-2">{event.title}</h3>
                <p className="text-[#6B7280] text-sm flex-1 mb-6">{event.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <span className="material-symbols-outlined text-lg">
                      {event.participants ? "group" : "timer"}
                    </span>
                    <span className="font-label-mono text-sm">
                      {event.participants ?? event.duration}
                    </span>
                  </div>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`border border-[#E5E5E5] px-4 py-1.5 rounded font-label-mono text-sm transition-all hover:border-current ${style.accent}`}
                  >
                    Open Platform
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Results Tab */}
      {tab === "past" && (
        <div className="space-y-8 animate-fade-in">
          {/* Pending Alert - omitted for simplicity or can be calculated if `yourRank` is "-" */}
          
          {/* Past events */}
          <div>
            <h3 className="font-headline-lg-mobile text-[#1A1A1A] flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent History
            </h3>
            {initialPast.length === 0 ? (
               <div className="text-center py-6 text-[#6B7280] font-label-mono text-sm">
                 No past events.
               </div>
            ) : (
            <div className="space-y-4">
              {initialPast.map((event) => (
                <div key={event.id} className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-panel">
                  <div className="p-4 border-b border-[#E5E5E5] flex justify-between items-center bg-[#F9FAFB]">
                    <div>
                      <h4 className="font-medium text-[#1A1A1A]">{event.title}</h4>
                      <p className="text-[12px] text-[#6B7280] font-label-mono">
                        {formatDate(new Date(event.date))} · Your Rank: {event.yourRank} · {event.yourScore !== "-" ? `Score: ${event.yourScore}` : "Not logged"}
                      </p>
                    </div>
                    {event.xpEarned > 0 ? (
                      <span className="text-primary font-label-mono text-sm bg-[#F0FDF4] px-2 py-1 rounded border border-primary/20">
                        +{event.xpEarned} XP
                      </span>
                    ) : (
                      <button onClick={() => setShowLogModal(true)} className="text-primary font-label-mono text-sm border border-primary px-3 py-1 hover:bg-[#F0FDF4] rounded">Log Result</button>
                    )}
                  </div>
                  {event.leaderboard.length > 0 && (
                  <div className="p-4">
                    <p className="font-label-mono text-[10px] uppercase text-[#6B7280] mb-2 tracking-wider">
                      Group Leaderboard
                    </p>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[#6B7280] border-b border-[#E5E5E5]">
                          <th className="pb-2 font-label-mono font-normal">Rank</th>
                          <th className="pb-2 font-label-mono font-normal">Name</th>
                          <th className="pb-2 font-label-mono font-normal text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {event.leaderboard.map((row) => (
                          <tr key={row.rank} className={row.name === "You" ? "bg-[#F0FDF4]" : ""}>
                            <td className={`py-2 font-label-mono ${row.name === "You" ? "text-primary font-bold" : "text-[#1A1A1A]"}`}>
                              {row.rank}
                            </td>
                            <td className={`py-2 ${row.name === "You" ? "text-primary font-bold" : "text-[#1A1A1A]"}`}>
                              {row.name}
                            </td>
                            <td className={`py-2 text-right font-label-mono ${row.name === "You" ? "text-primary font-bold" : "text-[#6B7280]"}`}>
                              {row.score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      )}

      {showLogModal && <LogResultModal onClose={() => setShowLogModal(false)} />}
    </div>
  );
}
