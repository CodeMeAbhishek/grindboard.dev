"use client";

import { useState } from "react";
import Link from "next/link";
import { getModuleColor } from "@/lib/gamification";
import { timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CodeforcesIcon, LeetCodeIcon, GeeksForGeeksIcon } from "@/components/icons/PlatformIcons";

interface Material {
  id: string;
  title: string;
  url: string;
  type: string;
  completed: boolean;
  metadata?: any;
}

interface Topic {
  id: string;
  name: string;
  completed: boolean;
  materials: Material[];
}

 interface Activity {
  id: string;
  type: string;
  label: string;
  createdAt: Date;
}

interface SubjectData {
  id: string;
  name: string;
  description: string;
  icon: string;
  streak: number;
  enrolledUsers: number;
  isEnrolled: boolean;
  topics: Topic[];
  activities: Activity[];
}

function getPlatformIcon(url: string) {
  if (!url) return null;
  if (url.includes("leetcode.com")) return <LeetCodeIcon className="w-5 h-5 shrink-0" />;
  if (url.includes("codeforces.com")) return <CodeforcesIcon className="w-5 h-5 shrink-0" />;
  if (url.includes("geeksforgeeks.org")) return <GeeksForGeeksIcon className="w-5 h-5 shrink-0" />;
  return null;
}

function TopicItem({ topic, color, isEnrolled, onEnrollmentError }: { topic: Topic, color: string, isEnrolled: boolean, onEnrollmentError: () => void }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const matsCompleted = topic.materials.filter(m => m.completed).length;
  const matsTotal = topic.materials.length;
  const isTopicDone = matsTotal > 0 ? matsCompleted === matsTotal : topic.completed;

  return (
    <div className="mb-4">
      <div 
        className="group flex justify-between items-center p-3 rounded bg-surface-container border border-outline mb-2 cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isTopicDone ? "border-primary bg-primary" : "border-outline"}`} style={{ borderColor: isTopicDone ? color : undefined, backgroundColor: isTopicDone ? color : undefined }}>
            {isTopicDone && <span className="material-symbols-outlined text-white text-sm">check</span>}
          </div>
          <span className={`font-medium text-sm ${isTopicDone ? "text-on-surface-variant" : "text-on-background"}`}>
            {topic.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-label-mono text-on-surface-variant">{matsCompleted}/{matsTotal} Materials</span>
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${isOpen ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </div>
      </div>
      
      {isOpen && topic.materials.length > 0 && (
        <div className="pl-6 border-l-2 border-outline ml-5 space-y-2 mb-4 animate-in slide-in-from-top-2 fade-in duration-200">
          {topic.materials.map((mat) => (
            <label key={mat.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-outline text-primary focus:ring-primary/20 transition-all"
                checked={mat.completed}
                onChange={async (e) => {
                  if (!isEnrolled) {
                    onEnrollmentError();
                    return;
                  }
                  const checked = e.target.checked;
                  await fetch("/api/materials/complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ materialId: mat.id, completed: checked })
                  });
                  router.refresh(); 
                }}
              />
              <div className="flex flex-row items-center justify-between flex-1 min-w-0">
                <a 
                  href={mat.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`text-sm flex items-center gap-1.5 transition-colors truncate ${mat.completed ? "text-on-surface-variant line-through" : "text-on-background hover:text-[#0EA5E9]"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-xs shrink-0">
                    {mat.type === "VIDEO" || mat.type === "YOUTUBE" ? "play_circle" : mat.type === "PDF" ? "picture_as_pdf" : "link"}
                  </span>
                  <span className="truncate">{mat.title}</span>
                </a>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {getPlatformIcon(mat.url)}
                  {mat.metadata?.tags && mat.metadata.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {mat.metadata.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] uppercase font-label-mono bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded border border-outline">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function SubjectDetailClient({ subject }: { subject: SubjectData }) {
  const router = useRouter();
  const color = getModuleColor(subject.name);
  const [toast, setToast] = useState<string | null>(null);

 const topicsDone = subject.topics.filter((t) => t.completed).length;
 const topicsPct = subject.topics.length > 0 ? Math.round((topicsDone / subject.topics.length) * 100) : 0;

  const handleEnrollmentError = () => {
    setToast("Please enroll in this subject first to track your progress.");
    setTimeout(() => setToast(null), 3000);
  };

 return (
 <>
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
  {subject.isEnrolled ? (
    subject.streak > 0 && (
      <div className="flex items-center gap-1.5 bg-[#FEF3C7] text-[#F59E0B] border border-[#F59E0B]/20 px-3 py-1.5 rounded font-label-mono text-sm">
        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        {subject.streak}-Day Streak
      </div>
    )
  ) : (
    <button
      onClick={async () => {
        await fetch('/api/modules/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId: subject.id })
        });
        router.refresh();
      }}
      className="bg-primary text-white px-4 py-1.5 rounded font-bold hover:bg-primary/90 transition-colors"
    >
      Enroll
    </button>
  )}
  </div>
 </div>
 </header>

 {/* Stats Row */}
 <section className="grid grid-cols-2 md:grid-cols-4 gap-sm">
 {[

 { label: "Enrolled", value: subject.enrolledUsers, sub: "group members" },

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
 {/* Progress */}
 <div className="glass-panel rounded-xl p-4 flex items-center justify-between mb-4">
   <div>
     <span className="font-label-mono text-on-surface-variant text-sm block">Topic Progress</span>
     <span className="text-xs text-on-surface-variant mt-1">{topicsDone} of {subject.topics.length} topics completed</span>
   </div>
   <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
     <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
       <path
         className="text-outline"
         strokeWidth="3.5"
         stroke="currentColor"
         fill="none"
         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
       />
       <path
         strokeWidth="3.5"
         strokeDasharray={`${topicsPct}, 100`}
         stroke={color}
         strokeLinecap="round"
         fill="none"
         style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
         d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
       />
     </svg>
     <div className="absolute flex items-center justify-center">
       <span className="text-[10px] font-bold font-label-mono text-on-background">{topicsPct}%</span>
     </div>
   </div>
 </div>
    <div className="glass-panel rounded-xl p-4 space-y-1">
      {subject.topics.length === 0 ? (
        <div className="text-center py-6 text-on-surface-variant font-label-mono text-sm">
          No topics found for this subject.
        </div>
      ) : subject.topics.map((topic) => (
        <TopicItem key={topic.id} topic={topic} color={color} isEnrolled={subject.isEnrolled} onEnrollmentError={handleEnrollmentError} />
      ))}
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

 </div>
 ))}
 </div>


 </div>
 </div>
 </div>
      
      {toast && (
        <div className="fixed bottom-6 right-6 bg-surface border border-outline shadow-panel p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
          <span className="material-symbols-outlined text-primary">info</span>
          <span className="text-sm text-on-background font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-on-surface-variant hover:text-on-background">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
 </>
 );
}
