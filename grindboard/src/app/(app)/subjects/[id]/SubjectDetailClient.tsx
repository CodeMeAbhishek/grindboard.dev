"use client";

import Link from "next/link";
import { getModuleColor } from "@/lib/gamification";
import { formatXP, timeAgo } from "@/lib/utils";

interface Topic {
 id: string;
 name: string;
 completed: boolean;
 xp: number;
}

interface Activity {
 id: string;
 type: string;
 label: string;
 xp: number;
 createdAt: Date;
}

interface SubjectData {
 id: string;
 name: string;
 description: string;
 icon: string;
 streak: number;
 totalXP: number;
 weeklyXP: number;
 weeklyGoal: number;
 enrolledUsers: number;
 topics: Topic[];
 activities: Activity[];
}

export function SubjectDetailClient({ subject }: { subject: SubjectData }) {
 const color = getModuleColor(subject.name);
 const pct = Math.min(100, Math.round((subject.weeklyXP / subject.weeklyGoal) * 100));
 const topicsDone = subject.topics.filter((t) => t.completed).length;
 const topicsPct = subject.topics.length > 0 ? Math.round((topicsDone / subject.topics.length) * 100) : 0;

 return (
 <div className="space-y-6">
 {/* Breadcrumb */}
 <nav className="flex items-center gap-2 text-sm font-label-mono text-on-surface-variant">
 <Link href="/subjects" className="hover:text-on-background transition-colors flex items-center gap-1">
 <span className="material-symbols-outlined text-sm">arrow_back</span>
 Subjects
 </Link>
 <span>/</span>
 <span className="text-on-background">{subject.name}</span>
 </nav>

 {/* Header */}
 <header className="bg-surface border border-outline shadow-panel rounded-xl p-6 relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-1">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-xl border border-outline flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
 <span className="material-symbols-outlined text-3xl" style={{ color }}>
 {subject.icon}
 </span>
 </div>
 <div>
 <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-background">{subject.name}</h1>
 <p className="text-on-surface-variant text-sm mt-0.5">{subject.description}</p>
 </div>
 </div>
 <div className="flex gap-2">
 <div className="flex items-center gap-1.5 bg-[#FEF3C7] text-[#F59E0B] border border-[#F59E0B]/20 px-3 py-1.5 rounded font-label-mono text-sm">
 <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
 {subject.streak}-Day Streak
 </div>
 <div className="flex items-center gap-1.5 bg-[#F0FDF4] text-primary border border-primary/20 px-3 py-1.5 rounded font-label-mono text-sm">
 <span className="material-symbols-outlined text-sm">bolt</span>
 {formatXP(subject.totalXP)} XP
 </div>
 </div>
 </div>
 </header>

 {/* Stats Row */}
 <section className="grid grid-cols-2 md:grid-cols-4 gap-sm">
 {[
 { label: "Weekly XP", value: `${subject.weeklyXP} / ${subject.weeklyGoal}`, sub: `${pct}% of goal` },
 { label: "Topics Done", value: `${topicsDone} / ${subject.topics.length}`, sub: `${topicsPct}% complete` },
 { label: "Enrolled", value: subject.enrolledUsers, sub: "group members" },
 { label: "This Week", value: `${pct >= 100 ? "✓" : pct + "%"}`, sub: pct >= 100 ? "Goal reached!" : "of weekly goal" },
 ].map((stat) => (
 <div key={stat.label} className="glass-panel p-4 rounded-xl">
 <span className="font-label-mono text-xs text-on-surface-variant uppercase tracking-wider block mb-2">{stat.label}</span>
 <div className="font-stat-lg text-on-background">{stat.value}</div>
 <div className="text-xs text-on-surface-variant mt-1">{stat.sub}</div>
 </div>
 ))}
 </section>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
 {/* Topics Checklist */}
 <div className="lg:col-span-7 space-y-4">
 <h2 className="font-headline-lg-mobile text-on-background flex items-center gap-2 border-b border-outline pb-2">
 <span className="material-symbols-outlined" style={{ color }}>checklist</span>
 Topics
 </h2>
 <div className="glass-panel rounded-xl p-4 space-y-1">
 {subject.topics.length === 0 ? (
 <div className="text-center py-6 text-on-surface-variant font-label-mono text-sm">
 No topics found for this subject.
 </div>
 ) : subject.topics.map((topic, idx) => (
 <div key={topic.id}>
 <div className={`group flex items-center gap-3 p-3 rounded hover:bg-surface-container border border-transparent hover:border-outline transition-all ${topic.completed ? "opacity-60" : ""}`}>
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${topic.completed ? "border-primary bg-primary" : "border-outline group-hover:border-primary"}`} style={{ borderColor: topic.completed ? color : undefined, backgroundColor: topic.completed ? color : undefined }}>
 {topic.completed && <span className="material-symbols-outlined text-white text-sm">check</span>}
 </div>
 <span className={`flex-1 text-sm ${topic.completed ? "line-through text-on-surface-variant" : "text-on-background"}`}>
 {topic.name}
 </span>
 <span className="font-label-mono text-xs px-2 py-0.5 rounded border" style={{ color, backgroundColor: `${color}10`, borderColor: `${color}30` }}>
 +{topic.xp} XP
 </span>
 </div>
 {idx < subject.topics.length - 1 && <div className="h-px bg-outline mx-3" />}
 </div>
 ))}
 </div>
 {/* Progress */}
 <div className="glass-panel rounded-xl p-4">
 <div className="flex justify-between text-sm mb-2">
 <span className="font-label-mono text-on-surface-variant">Topic Progress</span>
 <span className="font-bold" style={{ color }}>{topicsPct}%</span>
 </div>
 <div className="h-2 bg-outline rounded-full overflow-hidden">
 <div className="h-full rounded-full transition-all duration-700" style={{ width: `${topicsPct}%`, backgroundColor: color }} />
 </div>
 </div>
 </div>

 {/* Recent Activity */}
 <div className="lg:col-span-5 space-y-4">
 <h2 className="font-headline-lg-mobile text-on-background flex items-center gap-2 border-b border-outline pb-2">
 <span className="material-symbols-outlined text-[#0EA5E9]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
 Recent Activity
 </h2>
 <div className="glass-panel rounded-xl p-4 space-y-3">
 {subject.activities.length === 0 ? (
 <div className="text-center py-6 text-on-surface-variant font-label-mono text-sm">
 No recent activity.
 </div>
 ) : subject.activities.map((act) => (
 <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-container border border-outline hover:border-[#D1D5DB] transition-colors">
 <div className="w-8 h-8 rounded-full flex items-center justify-center border border-outline shrink-0" style={{ backgroundColor: `${color}10` }}>
 <span className="material-symbols-outlined text-sm" style={{ color }}>
 {act.type === "LEETCODE" ? "code" : act.type === "CODEFORCES" ? "terminal" : "check_circle"}
 </span>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm text-on-background truncate">{act.label}</p>
 <p className="text-xs text-on-surface-variant">{timeAgo(new Date(act.createdAt))}</p>
 </div>
 <span className="font-label-mono text-xs text-primary bg-[#F0FDF4] border border-primary/20 px-1.5 py-0.5 rounded shrink-0">
 +{act.xp}
 </span>
 </div>
 ))}
 </div>

 {/* Weekly XP bar */}
 <div className="glass-panel rounded-xl p-4">
 <div className="flex justify-between text-sm mb-2">
 <span className="font-label-mono text-on-surface-variant">Weekly Goal</span>
 <span className="font-bold" style={{ color }}>{subject.weeklyXP} / {subject.weeklyGoal} XP</span>
 </div>
 <div className="h-2 bg-outline rounded-full overflow-hidden">
 <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#10B981" : color }} />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
