"use client";

import { useState } from "react";
import Link from "next/link";
import { getModuleColor, getModuleIcon } from "@/lib/gamification";
import { timeAgo } from "@/lib/utils";

export interface Subject {
 id: string;
 name: string;
 enrolled: boolean;
 streak: number;
 weeklyXP: number;
 weeklyGoal: number;
 lastActiveDate: Date | null;
}

interface SubjectsClientProps {
 userId: string;
 initialSubjects: Subject[];
}

function SubjectCard({ subject, onToggle }: { subject: Subject; onToggle: (id: string) => void }) {
 const pct = Math.min(100, Math.round((subject.weeklyXP / subject.weeklyGoal) * 100));
 const color = getModuleColor(subject.name);
 const icon = getModuleIcon(subject.name);

 const accentMap: Record<string, string> = {
 "#10B981": "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20",
 "#0EA5E9": "text-[#0EA5E9] bg-[#0EA5E9]/10 border-[#0EA5E9]/20",
 "#F59E0B": "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20",
 "#8B5CF6": "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20",
 "#3B82F6": "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20",
 "#EF4444": "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
 };
 const accent = accentMap[color] ?? accentMap["#10B981"];

 const progressColor =
 pct >= 100
 ? "#10B981"
 : pct >= 50
 ? "#10B981"
 : pct < 20
 ? "#EF4444"
 : "#F59E0B";

 return (
 <article className="bg-surface border border-outline shadow-panel rounded-xl p-sm flex flex-col gap-3 relative overflow-hidden group hover:border-opacity-60 transition-colors">
 {/* Hover top accent */}
 <div
 className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
 style={{ backgroundColor: color }}
 />

 {/* Header */}
 <div className="flex justify-between items-start">
 <div className="flex items-center gap-3">
 <div
 className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline"
 style={{ backgroundColor: `${color}15` }}
 >
 <span className="material-symbols-outlined text-xl" style={{ color }}>
 {icon}
 </span>
 </div>
 <h3 className="font-bold text-on-background text-base leading-tight">{subject.name}</h3>
 </div>
 <Link
 href={`/subjects/${subject.id}`}
 className="text-[#E5E5E5] group-hover:text-on-surface-variant transition-colors"
 >
 <span className="material-symbols-outlined text-sm">open_in_new</span>
 </Link>
 </div>

 {/* Badges */}
 <div className="flex gap-2 flex-wrap font-label-mono text-xs">
 {subject.enrolled && subject.streak > 0 && (
 <span className={`px-2 py-1 rounded border flex items-center gap-1 ${accent}`}>
 <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
 local_fire_department
 </span>
 {subject.streak}-Day Streak
 </span>
 )}
 <span className="bg-surface-container text-on-surface-variant px-2 py-1 rounded border border-outline flex items-center gap-1">
 <span className="material-symbols-outlined text-sm">military_tech</span>
 {subject.weeklyXP} XP This Wk
 </span>
 </div>

 {/* Progress */}
 <div className="mt-auto pt-3 border-t border-outline flex justify-between items-end">
 <div className="flex flex-col gap-1 flex-1 mr-4">
 <div className="flex justify-between text-xs font-label-mono text-on-surface-variant">
 <span>Weekly Goal</span>
 <span style={{ color: progressColor }}>{pct}%</span>
 </div>
 <div className="h-1.5 w-full bg-outline rounded-full overflow-hidden">
 <div
 className="h-full rounded-full transition-all duration-500"
 style={{ width: `${pct}%`, backgroundColor: progressColor }}
 />
 </div>
 </div>

 {!subject.enrolled ? (
 <button
 onClick={() => onToggle(subject.id)}
 className="bg-[#F0FDF4] text-primary border border-primary/30 text-xs px-3 py-1 rounded font-label-mono hover:bg-primary hover:text-white transition-all"
 >
 Enroll
 </button>
 ) : (
 <span className="text-xs text-on-surface-variant italic">
 {subject.lastActiveDate ? timeAgo(subject.lastActiveDate) : "never active"}
 </span>
 )}
 </div>
 </article>
 );
}

export function SubjectsClient({ userId, initialSubjects }: SubjectsClientProps) {
 const [subjects, setSubjects] = useState(initialSubjects);
 const [search, setSearch] = useState("");
 const [filter, setFilter] = useState<"all" | "enrolled">("all");

 function toggleEnroll(id: string) {
 setSubjects((prev) =>
 prev.map((s) => (s.id === id ? { ...s, enrolled: !s.enrolled } : s))
 );
 }

 const filtered = subjects.filter((s) => {
 const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
 const matchFilter = filter === "all" || s.enrolled;
 return matchSearch && matchFilter;
 });

 return (
 <div className="space-y-6">
 {/* Header */}
 <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div>
 <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-background tracking-tight">
 My Subjects
 </h1>
 <p className="text-on-surface-variant mt-0.5 text-sm">
 Manage your academic and technical grind paths.
 </p>
 </div>
 <div className="flex gap-2">
 <button
 onClick={() => setFilter("all")}
 className={`px-4 py-2 rounded font-label-mono text-sm border transition-all ${
 filter === "all"
 ? "bg-[#F0FDF4] text-primary border-primary/30"
 : "bg-surface text-on-surface-variant border-outline hover:text-on-background"
 }`}
 >
 All
 </button>
 <button
 onClick={() => setFilter("enrolled")}
 className={`px-4 py-2 rounded font-label-mono text-sm border transition-all ${
 filter === "enrolled"
 ? "bg-[#F0FDF4] text-primary border-primary/30"
 : "bg-surface text-on-surface-variant border-outline hover:text-on-background"
 }`}
 >
 Enrolled
 </button>
 </div>
 </header>

 {/* Search */}
 <div className="glass-panel rounded-xl p-2">
 <div className="relative">
 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
 search
 </span>
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search subjects..."
 className="w-full bg-surface-container border border-outline rounded pl-10 pr-4 py-2 text-sm font-label-mono text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/50"
 />
 </div>
 </div>

 {/* Grid */}
 <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {filtered.map((subject) => (
 <SubjectCard key={subject.id} subject={subject} onToggle={toggleEnroll} />
 ))}
 {filtered.length === 0 && (
 <div className="col-span-full text-center py-12 text-on-surface-variant">
 <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
 No subjects found
 </div>
 )}
 </section>
 </div>
 );
}
