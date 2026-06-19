"use client";

import { useState } from "react";
import { getLevel } from "@/lib/gamification";

interface AdminUser {
  id: string;
  name: string;
  xp: number;
  isAdmin: boolean;
  initials: string;
}

interface AdminModule {
  id: string;
  name: string;
  topics: number;
  enrolled: number;
  color: string;
}

interface AdminClientProps {
  initialUsers: AdminUser[];
  initialModules: AdminModule[];
  stats: {
    activeUsers: number;
    avgXp: number;
  };
}

const XP_DISTRIBUTION = [
  { label: "Lvl 1-5", pct: 30 },
  { label: "Lvl 6-10", pct: 50 },
  { label: "Lvl 11-15", pct: 90 },
  { label: "Lvl 16-20", pct: 40 },
  { label: "Lvl 21+", pct: 20 },
];

export function AdminClient({ initialUsers, initialModules, stats }: AdminClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [deployed, setDeployed] = useState(false);

  function toggleAdmin(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isAdmin: !u.isAdmin } : u)));
    // Real app: call API to update role
  }

  function deployAnnouncement() {
    if (!announcement.trim()) return;
    setDeployed(true);
    setTimeout(() => setDeployed(false), 2000);
    setAnnouncement("");
    // Real app: POST /api/announcements
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const mockStats = [
    { label: "Active Users", value: stats.activeUsers.toString(), icon: "group", change: null, color: "text-primary" },
    { label: "Top Module", value: initialModules.length > 0 ? initialModules.reduce((max, m) => m.enrolled > max.enrolled ? m : max, initialModules[0]).name : "None", icon: "terminal", change: null, color: "text-[#0EA5E9]" },
    { label: "Avg. XP", value: stats.avgXp.toString(), icon: "bolt", change: null, color: "text-[#F59E0B]" },
    { label: "Event Part.", value: "88%", icon: "celebration", change: null, color: "text-primary", progress: 88 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="font-headline-lg text-[#1A1A1A] mb-1">Admin Overview</h1>
        <p className="text-[#6B7280]">System status and user management.</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sm">
        {mockStats.map((stat) => (
          <div key={stat.label} className="glass-panel p-sm rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[#6B7280] font-label-mono text-sm">{stat.label}</span>
              <span className={`material-symbols-outlined text-xl ${stat.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {stat.icon}
              </span>
            </div>
            <div className="font-stat-lg text-[#1A1A1A]">{stat.value}</div>
            {stat.change && (
              <div className={`mt-2 font-label-mono text-xs ${stat.color}`}>{stat.change}</div>
            )}
            {stat.progress !== undefined && (
              <div className="mt-2 w-full bg-[#E5E5E5] h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${stat.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-sm">
        {/* XP Distribution Bar Chart */}
        <div className="glass-panel p-md rounded-xl">
          <h3 className="font-label-mono text-sm text-[#6B7280] mb-6 uppercase tracking-wider">
            XP Distribution
          </h3>
          <div className="h-40 flex items-end justify-between gap-2 px-2">
            {XP_DISTRIBUTION.map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-sm bg-primary/30 hover:bg-primary/60 transition-colors border-t-2 border-primary relative"
                  style={{ height: `${bar.pct}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-primary whitespace-nowrap font-label-mono">
                    {bar.label}
                  </span>
                </div>
                <span className="text-[10px] text-[#6B7280] font-label-mono">{bar.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Activity Line Chart (SVG) */}
        <div className="glass-panel p-md rounded-xl flex flex-col">
          <h3 className="font-label-mono text-sm text-[#6B7280] mb-6 uppercase tracking-wider">
            Daily Activity
          </h3>
          <div className="flex-1 relative border-b border-l border-[#E5E5E5]/50 ml-4 mb-4">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q20,70 40,50 T80,30 T100,10" fill="none" stroke="#10B981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d="M0,100 L0,80 Q20,70 40,50 T80,30 T100,10 L100,100 Z" fill="url(#grad)" />
            </svg>
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Module Manager + User Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* Module Manager */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-sm border-b border-[#E5E5E5] flex justify-between items-center">
              <h3 className="font-label-mono text-sm uppercase text-[#1A1A1A]">Module Manager</h3>
              <button className="flex items-center gap-1 text-primary hover:text-[#059669] transition-colors text-sm font-label-mono">
                <span className="material-symbols-outlined text-sm">add</span>
                Add New
              </button>
            </div>
            <div className="p-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#6B7280] font-label-mono text-xs border-b border-[#E5E5E5]">
                    <th className="pb-2 font-normal">Subject</th>
                    <th className="pb-2 font-normal text-right">Topics</th>
                    <th className="pb-2 font-normal text-right">Enrolled</th>
                    <th className="pb-2 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#E5E5E5]">
                  {initialModules.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-[#6B7280] font-label-mono text-xs">No modules found</td>
                    </tr>
                  ) : initialModules.map((mod) => (
                    <tr key={mod.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 flex items-center gap-2 text-[#1A1A1A]">
                        <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: mod.color.replace('bg-', '') }} />
                        {mod.name}
                      </td>
                      <td className="py-3 text-right text-[#6B7280]">{mod.topics}</td>
                      <td className="py-3 text-right text-[#1A1A1A]">{mod.enrolled}</td>
                      <td className="py-3 text-right">
                        <button className="text-[#0EA5E9] hover:text-primary px-2 transition-colors">
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button className="text-[#EF4444] hover:text-[#EF4444]/80 px-2 transition-colors">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Manager */}
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-sm border-b border-[#E5E5E5] flex justify-between items-center">
              <h3 className="font-label-mono text-sm uppercase text-[#1A1A1A]">User Manager</h3>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="bg-white border border-[#E5E5E5] rounded px-3 py-1 text-sm focus:outline-none focus:border-primary w-44 font-label-mono transition-all"
                />
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">
                  search
                </span>
              </div>
            </div>
            <div className="p-sm space-y-2">
              {filtered.map((user, i) => {
                const userLevel = getLevel(user.xp).level;
                return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded bg-white border border-[#E5E5E5] hover:border-[#D1D5DB] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded bg-[#F3F4F6] flex items-center justify-center font-label-mono text-sm border"
                      style={{ color: i % 2 === 0 ? "#10B981" : "#0EA5E9", borderColor: i % 2 === 0 ? "#10B981" : "#0EA5E9" }}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#1A1A1A]">{user.name}</div>
                      <div className="text-xs text-[#6B7280] font-label-mono">Lvl {userLevel}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280] uppercase">Member</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={() => toggleAdmin(user.id)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
                      </label>
                      <span className={`text-xs font-bold uppercase ${user.isAdmin ? "text-primary" : "text-[#6B7280] opacity-50"}`}>
                        Admin
                      </span>
                    </div>
                    <button className="bg-white border border-[#E5E5E5] hover:border-[#0EA5E9] px-2 py-1 rounded text-xs font-label-mono flex items-center gap-1 transition-colors group text-[#1A1A1A]">
                      <span>{user.xp.toLocaleString()} XP</span>
                      <span className="material-symbols-outlined text-sm text-[#6B7280] group-hover:text-[#0EA5E9]">edit</span>
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </div>

        {/* Broadcast / Announcement Editor */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-xl overflow-hidden h-full flex flex-col">
            <div className="p-sm border-b border-[#E5E5E5]">
              <h3 className="font-label-mono text-sm text-[#1A1A1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F59E0B]" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                Broadcast
              </h3>
            </div>
            <div className="p-sm flex-1 flex flex-col gap-4">
              <p className="text-sm text-[#6B7280]">Post updates to the global dashboard feed.</p>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                rows={8}
                className="w-full flex-1 bg-white border border-[#E5E5E5] rounded-lg p-3 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30 transition-all resize-none font-body-md text-[#1A1A1A]"
                placeholder="Enter announcement text..."
              />
              <div className="flex justify-between items-center mt-auto">
                <button className="text-[#6B7280] hover:text-primary p-2 transition-colors">
                  <span className="material-symbols-outlined text-sm">attachment</span>
                </button>
                <button
                  onClick={deployAnnouncement}
                  className={`px-6 py-2 rounded-lg font-label-mono text-sm transition-all flex items-center gap-2 ${
                    deployed
                      ? "bg-primary text-white"
                      : "bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 border border-[#F59E0B]/30"
                  }`}
                >
                  <span>{deployed ? "Deployed!" : "Deploy"}</span>
                  <span className="material-symbols-outlined text-sm">{deployed ? "check" : "send"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] pt-4 text-center text-xs text-[#6B7280] font-label-mono pb-4">
        SYSTEM.ONLINE // GRINDBOARD_OS_V1.0 // SECURE_CONNECTION
      </footer>
    </div>
  );
}
