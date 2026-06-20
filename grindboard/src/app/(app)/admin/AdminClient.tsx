"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSkillLevel } from "@/lib/gamification";
import { ModuleManager } from "@/components/admin/ModuleManager";

interface AdminUser {
 id: string;
 name: string;
 cfRating: number | null;
 lcRating: number | null;
 isAdmin: boolean;
 initials: string;
}

interface AdminModule {
 id: string;
 name: string;
 topics: any[];
 enrolled: number;
 color: string;
}

interface AdminClientProps {
 initialUsers: AdminUser[];
 initialModules: AdminModule[];
 stats: {
 activeUsers: number;
 };
}


export function AdminClient({ initialUsers, initialModules, stats }: AdminClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [deployed, setDeployed] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", description: "", icon: "book", color: "#10B981" });
  const [loading, setLoading] = useState(false);

  const handleAddModule = async () => {
    if (!newModule.name.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModule),
      });
      setNewModule({ name: "", description: "", icon: "book", color: "#10B981" });
      setShowAddModule(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
 { label: "Event Part.", value: "88%", icon: "celebration", change: null, color: "text-primary", progress: 88 },
 ];

 return (
 <div className="space-y-6">
 {/* Header */}
 <header>
 <h1 className="font-headline-lg text-on-background mb-1">Admin Overview</h1>
 <p className="text-on-surface-variant">System status and user management.</p>
 </header>

 {/* Stats Grid */}
 <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-sm">
 {mockStats.map((stat) => (
 <div key={stat.label} className="glass-panel p-sm rounded-xl">
 <div className="flex justify-between items-start mb-4">
 <span className="text-on-surface-variant font-label-mono text-sm">{stat.label}</span>
 <span className={`material-symbols-outlined text-xl ${stat.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
 {stat.icon}
 </span>
 </div>
 <div className="font-stat-lg text-on-background">{stat.value}</div>
 {stat.change && (
 <div className={`mt-2 font-label-mono text-xs ${stat.color}`}>{stat.change}</div>
 )}
 {stat.progress !== undefined && (
 <div className="mt-2 w-full bg-outline h-1.5 rounded-full overflow-hidden">
 <div className="bg-primary h-full rounded-full" style={{ width: `${stat.progress}%` }} />
 </div>
 )}
 </div>
 ))}
 </section>

 {/* Charts */}
 <section className="grid grid-cols-1 gap-sm">

 {/* Daily Activity Line Chart (SVG) */}
 <div className="glass-panel p-md rounded-xl flex flex-col">
 <h3 className="font-label-mono text-sm text-on-surface-variant mb-6 uppercase tracking-wider">
 Daily Activity
 </h3>
 <div className="flex-1 relative border-b border-l border-outline/50 ml-4 mb-4">
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
 <div className="p-sm border-b border-outline flex justify-between items-center">
 <h3 className="font-label-mono text-sm uppercase text-on-background">Module Manager</h3>
 <button 
   onClick={() => setShowAddModule(!showAddModule)}
   className="flex items-center gap-1 text-primary hover:text-[#059669] transition-colors text-sm font-label-mono"
 >
 <span className="material-symbols-outlined text-sm">{showAddModule ? "close" : "add"}</span>
 {showAddModule ? "Cancel" : "Add New"}
 </button>
 </div>
 {showAddModule && (
   <div className="p-sm border-b border-outline bg-surface-container flex flex-col gap-4">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
       <div>
         <label className="text-xs font-label-mono text-on-surface-variant mb-1 block">Module Name</label>
         <input
           type="text"
           placeholder="e.g., System Design"
           className="w-full border border-outline rounded-lg px-3 py-2 bg-surface text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all"
           value={newModule.name}
           onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
         />
       </div>
       <div>
         <label className="text-xs font-label-mono text-on-surface-variant mb-1 block">Description</label>
         <input
           type="text"
           placeholder="Brief description of the module"
           className="w-full border border-outline rounded-lg px-3 py-2 bg-surface text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm transition-all"
           value={newModule.description}
           onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
         />
       </div>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
       <div className="md:col-span-1">
         <label className="text-xs font-label-mono text-on-surface-variant mb-1 block">Icon (Material Symbol)</label>
         <div className="relative">
           <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
             {newModule.icon || "book"}
           </span>
           <input
             type="text"
             placeholder="terminal, code, book"
             className="w-full border border-outline rounded-lg pl-9 pr-3 py-2 bg-surface text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm font-label-mono transition-all"
             value={newModule.icon}
             onChange={(e) => setNewModule({ ...newModule, icon: e.target.value })}
           />
         </div>
       </div>
       
       <div className="md:col-span-1">
         <label className="text-xs font-label-mono text-on-surface-variant mb-1 block">Theme Color</label>
         <div className="flex items-center gap-2 border border-outline rounded-lg p-1.5 bg-surface">
           <input
             type="color"
             className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
             value={newModule.color}
             onChange={(e) => setNewModule({ ...newModule, color: e.target.value })}
           />
           <span className="text-sm font-label-mono text-on-surface-variant">{newModule.color.toUpperCase()}</span>
         </div>
       </div>
 
       <div className="md:col-span-1 flex justify-end">
         <button 
           disabled={loading || !newModule.name}
           onClick={handleAddModule}
           className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#059669] disabled:opacity-50 text-sm font-medium transition-colors flex items-center justify-center gap-2"
         >
           <span className="material-symbols-outlined text-sm">{loading ? "hourglass_empty" : "add_circle"}</span>
           {loading ? "Creating..." : "Create Module"}
         </button>
       </div>
     </div>
   </div>
 )}
 <div className="p-sm">
    <ModuleManager initialModules={initialModules} />
  </div>
 </div>

 {/* User Manager */}
 <div className="glass-panel rounded-xl overflow-hidden">
 <div className="p-sm border-b border-outline flex justify-between items-center">
 <h3 className="font-label-mono text-sm uppercase text-on-background">User Manager</h3>
 <div className="relative">
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search users..."
 className="bg-surface border border-outline rounded px-3 py-1 text-sm focus:outline-none focus:border-primary w-44 font-label-mono transition-all"
 />
 <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
 search
 </span>
 </div>
 </div>
 <div className="p-sm space-y-2">
 {filtered.map((user, i) => {
 const userLevel = getSkillLevel(user.cfRating, user.lcRating).name;
 return (
 <div
 key={user.id}
 className="flex items-center justify-between p-3 rounded bg-surface border border-outline hover:border-[#D1D5DB] transition-colors"
 >
 <div className="flex items-center gap-3">
 <div
 className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-label-mono text-sm border"
 style={{ color: i % 2 === 0 ? "#10B981" : "#0EA5E9", borderColor: i % 2 === 0 ? "#10B981" : "#0EA5E9" }}
 >
 {user.initials}
 </div>
 <div>
 <div className="text-sm font-medium text-on-background">{user.name}</div>
 <div className="text-xs text-on-surface-variant font-label-mono">Lvl {userLevel}</div>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-2">
 <span className="text-xs text-on-surface-variant uppercase">Member</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input
 type="checkbox"
 checked={user.isAdmin}
 onChange={() => toggleAdmin(user.id)}
 className="sr-only peer"
 />
 <div className="w-8 h-4 bg-outline peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-surface after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
 </label>
 <span className={`text-xs font-bold uppercase ${user.isAdmin ? "text-primary" : "text-on-surface-variant opacity-50"}`}>
 Admin
 </span>
 </div>
 <button className="bg-surface border border-outline hover:border-[#0EA5E9] px-2 py-1 rounded text-xs font-label-mono flex items-center gap-1 transition-colors group text-on-background">
 <span>Edit</span>
 <span className="material-symbols-outlined text-sm text-on-surface-variant group-hover:text-[#0EA5E9]">edit</span>
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
 <div className="p-sm border-b border-outline">
 <h3 className="font-label-mono text-sm text-on-background flex items-center gap-2">
 <span className="material-symbols-outlined text-[#F59E0B]" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
 Broadcast
 </h3>
 </div>
 <div className="p-sm flex-1 flex flex-col gap-4">
 <p className="text-sm text-on-surface-variant">Post updates to the global dashboard feed.</p>
 <textarea
 value={announcement}
 onChange={(e) => setAnnouncement(e.target.value)}
 rows={8}
 className="w-full flex-1 bg-surface border border-outline rounded-lg p-3 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]/30 transition-all resize-none font-body-md text-on-background"
 placeholder="Enter announcement text..."
 />
 <div className="flex justify-between items-center mt-auto">
 <button className="text-on-surface-variant hover:text-primary p-2 transition-colors">
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
 <footer className="border-t border-outline pt-4 text-center text-xs text-on-surface-variant font-label-mono pb-4">
 SYSTEM.ONLINE // GRINDBOARD_OS_V1.0 // SECURE_CONNECTION
 </footer>
 </div>
 );
}
