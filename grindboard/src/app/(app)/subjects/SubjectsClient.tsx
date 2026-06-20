"use client";

import { useState } from "react";
import Link from "next/link";
import { getModuleColor, getModuleIcon } from "@/lib/gamification";
import { timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CodeforcesIcon, LeetCodeIcon, GeeksForGeeksIcon } from "@/components/icons/PlatformIcons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SkeletonPage } from "@/components/skeletons";

export interface Subject {
 id: string;
 name: string;
 enrolled: boolean;
 streak: number;
 lastActiveDate: Date | null;
 progressPercentage: number;
 totalMaterials: number;
 completedMaterials: number;
}

interface SubjectsClientProps {
 userId: string;
}

const COMING_SOON_SUBJECTS = [
  "GATE Preparation",
  "Machine Learning",
  "Web Development"
];

function ComingSoonSubjectCard({ name }: { name: string }) {
  const color = getModuleColor(name);
  const icon = getModuleIcon(name);
  
  return (
    <article className="bg-surface border border-outline border-dashed shadow-sm rounded-xl p-sm flex flex-col gap-3 relative overflow-hidden h-full opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-not-allowed">
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
          <h3 className="font-bold text-on-background text-base leading-tight">{name}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <div className="mt-2">
          <button
            disabled
            className="w-full bg-surface-container-high text-on-surface-variant text-sm font-bold py-2 rounded border border-outline cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </article>
  );
}

function SubjectCard({ subject, onEnroll }: { subject: Subject, onEnroll: (id: string) => void }) {
  const router = useRouter();
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



  const isCP = subject.name.toLowerCase().includes("competitive programming") || subject.name === "CP";
  const isDSA = subject.name.toLowerCase().includes("dsa") || subject.name.toLowerCase().includes("data structure");

  return (
    <Link href={`/subjects/${subject.id}`} className="group block outline-none h-full">
      <article className="bg-surface border border-outline shadow-panel rounded-xl p-sm flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg h-full">
        {/* Hover top accent */}
        <div
          className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: color }}
        />

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline group-hover:scale-105 transition-transform"
              style={{ backgroundColor: `${color}15` }}
            >
              <span className="material-symbols-outlined text-xl" style={{ color }}>
                {icon}
              </span>
            </div>
            <h3 className="font-bold text-on-background text-base leading-tight group-hover:text-primary transition-colors">{subject.name}</h3>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container border border-outline flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </div>

        {/* Badges and Progress */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap font-label-mono text-xs">
            {subject.enrolled && subject.streak > 0 && (
              <span className={`px-2 py-1 rounded border flex items-center gap-1 ${accent}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
                {subject.streak}-Day Streak
              </span>
            )}
            
            {isCP && (
              <span className="px-2 py-1 rounded border border-outline bg-surface-container flex items-center gap-1.5 text-on-surface-variant">
                <CodeforcesIcon className="w-3.5 h-3.5" />
                <span className="font-semibold text-on-background">{subject.totalMaterials} Qs</span>
              </span>
            )}

            {isDSA && (
              <span className="px-2 py-1 rounded border border-outline bg-surface-container flex items-center gap-1.5 text-on-surface-variant">
                <GeeksForGeeksIcon className="w-3.5 h-3.5" />
                <LeetCodeIcon className="w-3.5 h-3.5 -ml-0.5" />
                <span className="font-semibold text-on-background ml-0.5">{subject.totalMaterials} Qs</span>
              </span>
            )}
          </div>

          {/* Progress Bar or Enroll Button */}
          {subject.enrolled ? (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between items-center text-xs font-label-mono">
                <span className="text-on-surface-variant">Progress</span>
                <span className="text-on-background font-bold">{subject.progressPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${subject.progressPercentage}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-[10px] text-on-surface-variant text-right">
                {subject.completedMaterials} / {subject.totalMaterials} completed
              </span>
            </div>
          ) : (
            <div className="mt-2">
              <button
                onClick={async (e) => {
                  e.preventDefault(); // Prevent Link navigation
                  e.stopPropagation();
                  
                  // Optimistically update UI
                  onEnroll(subject.id);

                  await fetch('/api/modules/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ moduleId: subject.id })
                  });
                  // Not calling router.refresh() anymore, let's invalidate query if needed
                }}
                className="w-full bg-primary text-white text-sm font-bold py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Enroll Now
              </button>
            </div>
          )}
        </div>

        {subject.enrolled && (
          <div className="mt-auto pt-3 border-t border-outline flex justify-between items-end">
            <span className="text-xs text-on-surface-variant italic">
              {subject.lastActiveDate ? timeAgo(new Date(subject.lastActiveDate)) : "never active"}
            </span>
          </div>
        )}
      </article>
    </Link>
  );
}

export function SubjectsClient({ userId }: SubjectsClientProps) {
 const [search, setSearch] = useState("");
 const queryClient = useQueryClient();

 const { data: subjects, isLoading, error } = useQuery<Subject[]>({
   queryKey: ['subjects'],
   queryFn: async () => {
     const res = await fetch('/api/subjects');
     if (!res.ok) throw new Error('Failed to fetch subjects');
     return res.json();
   }
 });

 if (isLoading) {
   return <SkeletonPage />;
 }

 if (error || !subjects) {
   return <div className="p-8 text-red-500 text-center">Failed to load subjects.</div>;
 }

 const handleEnroll = (id: string) => {
   // Optimistically update the cache
   queryClient.setQueryData<Subject[]>(['subjects'], (old) => {
     if (!old) return old;
     return old.map(s => s.id === id ? { ...s, enrolled: true } : s);
   });
 };

 const filtered = subjects.filter((s) => {
 return s.name.toLowerCase().includes(search.toLowerCase());
 });

 const filteredComingSoon = COMING_SOON_SUBJECTS.filter((s) => 
   s.toLowerCase().includes(search.toLowerCase()) && !subjects.some(sub => sub.name === s)
 );

 return (
 <div className="space-y-6 animate-fade-in">
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
 <SubjectCard key={subject.id} subject={subject} onEnroll={handleEnroll} />
 ))}
 {filteredComingSoon.map((name) => (
  <ComingSoonSubjectCard key={name} name={name} />
 ))}
 {filtered.length === 0 && filteredComingSoon.length === 0 && (
 <div className="col-span-full text-center py-12 text-on-surface-variant">
 <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
 No subjects found
 </div>
 )}
 </section>
 </div>
 );
}
