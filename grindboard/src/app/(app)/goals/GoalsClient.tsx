"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { getModuleColor } from "@/lib/gamification";

export interface Goal {
 id: string;
 title: string;
 description: string;
 module: string;
 current: number;
 target: number;
 deadline: Date | null;
 archived: boolean;
 metric: string;
}

interface GoalsClientProps {
 initialActiveGoals: Goal[];
 initialArchivedGoals: Goal[];
 modules: string[];
}

function GoalCard({ goal }: { goal: Goal }) {
 const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
 const color = getModuleColor(goal.module) ?? "#10B981";
 const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000) : null;
 const urgency = daysLeft === null ? "text-on-surface-variant" : daysLeft <= 3 ? "text-[#EF4444]" : daysLeft <= 7 ? "text-[#F59E0B]" : "text-on-surface-variant";

 return (
 <article className="bg-surface border border-outline shadow-panel rounded-xl p-sm flex flex-col gap-4 relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />

 <div className="flex justify-between items-start pt-1">
 <span
 className="font-label-mono text-xs px-2 py-1 rounded border"
 style={{ color, backgroundColor: `${color}15`, borderColor: `${color}30` }}
 >
 {goal.module}
 </span>
 <span className={`text-xs flex items-center gap-1 font-label-mono ${urgency}`}>
 <span className="material-symbols-outlined text-sm">schedule</span>
 {daysLeft === null ? "No deadline" : daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
 </span>
 </div>

 <div>
 <h3 className="font-stat-lg text-on-background mb-0.5">{goal.title}</h3>
 <p className="text-on-surface-variant text-sm">{goal.description}</p>
 </div>

 <div className="flex flex-col gap-2 mt-auto">
 <div className="flex justify-between text-sm">
 <span className="text-on-background">
 {goal.current} / {goal.target} {goal.metric}
 </span>
 <span className="font-bold" style={{ color }}>{pct}%</span>
 </div>
 <div className="h-2 w-full bg-outline rounded-full overflow-hidden">
 <div
 className="h-full rounded-full transition-all duration-500"
 style={{ width: `${pct}%`, backgroundColor: color }}
 />
 </div>
 <div className="flex justify-between items-center">
 <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">{goal.module}</span>
 <button className="flex items-center gap-1 text-sm font-bold transition-colors" style={{ color }}>
 Log Progress
 <span className="material-symbols-outlined text-sm">add</span>
 </button>
 </div>
 </div>
 </article>
 );
}

export function GoalsClient({ initialActiveGoals, initialArchivedGoals, modules }: GoalsClientProps) {
 const [showAddModal, setShowAddModal] = useState(false);
 const [goals] = useState(initialActiveGoals);
 const [archivedGoals] = useState(initialArchivedGoals);
 const [newGoal, setNewGoal] = useState({
 title: "", module: modules[0] || "General", target: "", metric: "count", deadline: "",
 });

 return (
 <div className="space-y-8">
 {/* Header */}
 <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline pb-6">
 <div>
 <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-background">
 Active Objectives
 </h1>
 <p className="text-on-surface-variant mt-0.5">Track your grind across all disciplines.</p>
 </div>
 <button
 onClick={() => setShowAddModal(true)}
 className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#059669] transition-colors flex items-center gap-2"
 >
 <span className="material-symbols-outlined">add</span>
 Add Goal
 </button>
 </header>

 {/* Active Goals Grid */}
 <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
 {goals.length === 0 ? (
 <div className="col-span-full text-center py-12 text-on-surface-variant font-label-mono text-sm">
 No active goals. Time to set one!
 </div>
 ) : goals.map((goal) => (
 <GoalCard key={goal.id} goal={goal} />
 ))}
 </section>

 {/* Archived Section */}
 <section className="border-t border-outline pt-8">
 <h2 className="font-headline-lg-mobile text-on-background mb-6 flex items-center gap-2">
 <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
 task_alt
 </span>
 Archived Triumphs
 </h2>
 {archivedGoals.length === 0 ? (
 <p className="text-on-surface-variant text-sm italic">No archived goals yet.</p>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {archivedGoals.map((goal) => (
 <div
 key={goal.id}
 className="bg-surface border border-outline shadow-panel p-4 rounded-lg flex items-center justify-between opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
 >
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="font-label-mono text-[10px] text-on-background border border-outline px-1.5 py-0.5 rounded">
 {goal.module}
 </span>
 <span className="text-xs text-on-surface-variant">
 Completed {goal.deadline ? formatDate(new Date(goal.deadline)) : "Successfully"}
 </span>
 </div>
 <h4 className="text-on-background font-bold line-through">{goal.title}</h4>
 </div>
 <div className="bg-primary/20 p-2 rounded-full text-primary">
 <span className="material-symbols-outlined">check</span>
 </div>
 </div>
 ))}
 </div>
 )}
 </section>

 {/* Add Goal Modal */}
 {showAddModal && (
 <div
 className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-fade-in"
 onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
 >
 <div className="bg-surface border border-outline rounded-xl w-full max-w-lg shadow-modal border-t-2 border-t-primary animate-slide-up">
 <div className="flex justify-between items-center p-6 border-b border-outline">
 <h2 className="font-headline-lg-mobile text-on-background">Initialize New Goal</h2>
 <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-[#EF4444] transition-colors p-1">
 <span className="material-symbols-outlined">close</span>
 </button>
 </div>
 <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
 <div>
 <label className="block font-label-mono text-xs text-on-surface-variant uppercase mb-1.5">Subject Tag</label>
 <select value={newGoal.module} onChange={(e) => setNewGoal({ ...newGoal, module: e.target.value })} className="input-base">
 {modules.map((m) => (
 <option key={m} value={m}>{m}</option>
 ))}
 </select>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block font-label-mono text-xs text-on-surface-variant uppercase mb-1.5">Metric</label>
 <select value={newGoal.metric} onChange={(e) => setNewGoal({ ...newGoal, metric: e.target.value })} className="input-base">
 <option value="count">Problems Solved</option>
 <option value="hours">Hours Focused</option>
 <option value="topics">Topics Covered</option>
 <option value="contests">Contests</option>
 </select>
 </div>
 <div>
 <label className="block font-label-mono text-xs text-on-surface-variant uppercase mb-1.5">Target Value</label>
 <input type="number" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} className="input-base" placeholder="50" required />
 </div>
 </div>
 <div>
 <label className="block font-label-mono text-xs text-on-surface-variant uppercase mb-1.5">Objective Title</label>
 <input type="text" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} className="input-base" placeholder="e.g., Master Dynamic Programming" required />
 </div>
 <div>
 <label className="block font-label-mono text-xs text-on-surface-variant uppercase mb-1.5">Deadline</label>
 <input type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} className="input-base" required />
 </div>
 <div className="flex gap-3 pt-4 border-t border-outline">
 <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-outline text-on-surface-variant rounded font-label-mono text-sm hover:bg-background transition-colors">
 Cancel
 </button>
 <button type="submit" className="flex-1 bg-primary text-white py-2 rounded font-label-mono text-sm hover:bg-[#059669] transition-colors font-bold">
 Deploy Goal
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
}
