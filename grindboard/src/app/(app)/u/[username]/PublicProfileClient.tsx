"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSkillLevel, BADGE_DEFINITIONS } from "@/lib/gamification";
import { CodeforcesIcon, LeetCodeIcon, LinkedInIcon } from "@/components/icons/PlatformIcons";

interface PublicUserProfile {
  name: string;
  username: string | null;
  avatarUrl: string | null;
  globalStreak: number;
  cfHandle: string | null;
  lcHandle: string | null;
  linkedin: string | null;
  cfRating: number | null;
  cfMaxRating: number | null;
  cfRank: string | null;
  lcRating: number | null;
  lcGlobalRanking: number | null;
  lcBadge: string | null;
  activities: any[];
  userBadges: any[];
}

export default function PublicProfileClient({ user, isCurrentUser }: { user: PublicUserProfile; isCurrentUser?: boolean }) {
  const router = useRouter();
  const heatmapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedYear, setSelectedYear] = useState<string>("Past Year");
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [cfHandle, setCfHandle] = useState(user.cfHandle || "");
  const [lcHandle, setLcHandle] = useState(user.lcHandle || "");
  const [linkedin, setLinkedin] = useState(user.linkedin || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          cfHandle: cfHandle.trim() || null,
          lcHandle: lcHandle.trim() || null,
          linkedin: linkedin.trim() || null,
          avatarUrl: avatarUrl.trim() || null,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        setErrorMsg("");
        router.refresh();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setAvatarUrl(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Format activity counts for heatmap
  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    user.activities.forEach(act => {
      const dateStr = new Date(act.date || act.createdAt).toISOString().split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    return counts;
  }, [user.activities]);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    Object.keys(activityCounts).forEach(date => {
      years.add(date.substring(0, 4));
    });
    years.add(new Date().getFullYear().toString());
    return ["Past Year", ...Array.from(years).sort().reverse()];
  }, [activityCounts]);

  const level = getSkillLevel(user.cfRating, user.lcRating);

  useEffect(() => {
    if (!heatmapRef.current) return;
    const grid = heatmapRef.current;
    grid.innerHTML = "";
    
    let startDate: Date;
    let numDays: number;
    
    if (selectedYear === "Past Year") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 364);
      numDays = 365;
    } else {
      const year = parseInt(selectedYear);
      startDate = new Date(year, 0, 1);
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      numDays = isLeap ? 366 : 365;
    }

    const startDayOfWeek = startDate.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.style.width = "10px";
      emptyCell.style.height = "10px";
      grid.appendChild(emptyCell);
    }
    
    for (let i = 0; i < numDays; i++) {
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";
      
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      const count = activityCounts[dateStr] || 0;
      
      let intensity = 0;
      if (count >= 5) intensity = 4;
      else if (count >= 3) intensity = 3;
      else if (count >= 2) intensity = 2;
      else if (count >= 1) intensity = 1;
      
      cell.setAttribute("data-intensity", String(intensity));
      cell.title = count > 0 
        ? `${count} problem${count > 1 ? 's' : ''} solved on ${date.toDateString()}` 
        : `No activity on ${date.toDateString()}`;
        
      grid.appendChild(cell);
    }
  }, [activityCounts, selectedYear]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 pt-4">
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="font-display-lg text-3xl font-black tracking-tight text-on-background">
            {user.name}'s Profile
          </h1>
          <p className="text-on-surface-variant font-label-mono mt-1">
            {user.username ? `@${user.username}` : "Member"}
          </p>
        </div>
        {isCurrentUser && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 border border-outline hover:border-primary hover:text-primary text-on-surface-variant rounded px-4 py-2 font-label-mono text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Edit Profile
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          {/* Identity & Level Card */}
          <div className="bg-surface rounded-xl p-6 border border-outline shadow-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-primary object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="font-bold text-xl text-on-background">{user.name}</h2>
                <div className="text-sm font-label-mono text-primary flex items-center gap-2">
                  <span>Level {level.name}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              {user.linkedin ? (
                <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-on-surface-variant hover:text-[#0A66C2] transition-colors bg-surface-container-low p-2 rounded-lg border border-outline/50 hover:border-[#0A66C2]/30">
                  <LinkedInIcon className="w-5 h-5" />
                  <span>LinkedIn Profile</span>
                </a>
              ) : isCurrentUser && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 w-full text-sm text-on-surface-variant hover:text-[#0A66C2] transition-colors bg-surface-container-low p-2 rounded-lg border border-outline/50 hover:border-[#0A66C2]/30 border-dashed">
                  <LinkedInIcon className="w-5 h-5 opacity-50" />
                  <span>Link LinkedIn</span>
                </button>
              )}
              
              {user.lcHandle ? (
                <div className="flex items-center justify-between p-2 rounded-lg border border-outline/50 bg-surface-container-low">
                  <div className="flex items-center gap-3">
                    <LeetCodeIcon className="w-5 h-5" />
                    <div>
                      <a href={`https://leetcode.com/u/${user.lcHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-on-background hover:text-primary transition-colors">
                        {user.lcHandle}
                      </a>
                    </div>
                  </div>
                </div>
              ) : isCurrentUser && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 w-full text-sm text-on-surface-variant hover:text-orange-500 transition-colors bg-surface-container-low p-2 rounded-lg border border-outline/50 hover:border-orange-500/30 border-dashed">
                  <LeetCodeIcon className="w-5 h-5 opacity-50" />
                  <span>Link LeetCode</span>
                </button>
              )}
              
              {user.cfHandle ? (
                <div className="flex items-center justify-between p-2 rounded-lg border border-outline/50 bg-surface-container-low">
                  <div className="flex items-center gap-3">
                    <CodeforcesIcon className="w-5 h-5" />
                    <div>
                      <a href={`https://codeforces.com/profile/${user.cfHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-on-background hover:text-primary transition-colors">
                        {user.cfHandle}
                      </a>
                    </div>
                  </div>
                </div>
              ) : isCurrentUser && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 w-full text-sm text-on-surface-variant hover:text-blue-500 transition-colors bg-surface-container-low p-2 rounded-lg border border-outline/50 hover:border-blue-500/30 border-dashed">
                  <CodeforcesIcon className="w-5 h-5 opacity-50" />
                  <span>Link Codeforces</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-5 border border-outline shadow-panel">
            <h3 className="font-label-mono text-xs text-on-surface-variant uppercase tracking-wider mb-4">
              Current Streak
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter text-orange-500">
                {user.globalStreak}
              </span>
              <span className="text-sm font-label-mono text-on-surface-variant">days</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface border border-outline rounded-xl p-6 shadow-panel">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-label-mono text-sm font-bold tracking-wider uppercase text-on-surface-variant">Activity Calendar</h2>
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-surface-container border border-outline rounded px-2 py-1 text-xs font-label-mono focus:outline-none focus:border-primary transition-colors text-on-background"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[800px]">
                <div className="flex text-xs font-label-mono text-on-surface-variant/70 mb-2">
                  <div className="w-8"></div>
                  <div className="flex-1 flex justify-between pr-4">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-8 flex flex-col justify-between text-xs font-label-mono text-on-surface-variant/70 py-1 h-[110px]">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>
                  <div 
                    ref={heatmapRef} 
                    className="grid grid-flow-col gap-1 flex-1"
                    style={{ gridTemplateRows: "repeat(7, 10px)" }}
                  ></div>
                </div>
                
                <div className="flex justify-end items-center gap-2 mt-4 text-xs font-label-mono text-on-surface-variant">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-surface-container-highest border border-outline/50"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary/30 border border-primary/20"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary/60 border border-primary/40"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary border border-primary/60"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#047857] border border-[#047857]/80 shadow-[0_0_4px_rgba(5,150,105,0.4)]"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-outline rounded-xl p-5 shadow-panel">
              <h2 className="font-label-mono text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-4 flex items-center justify-between">
                <span>Recent Activity</span>
              </h2>
              {user.activities.length === 0 ? (
                <div className="text-sm text-on-surface-variant py-4 text-center">No recent activities.</div>
              ) : (
                <div className="space-y-4">
                  {user.activities.map((act) => (
                    <div key={act.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-high border border-outline flex items-center justify-center shrink-0">
                        {act.type === "LEETCODE" ? (
                          <span className="material-symbols-outlined text-sm text-orange-500">code</span>
                        ) : act.type === "CODEFORCES" ? (
                          <span className="material-symbols-outlined text-sm text-blue-500">functions</span>
                        ) : (
                          <span className="material-symbols-outlined text-sm text-primary">task_alt</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-background line-clamp-1">
                          {act.type === "LEETCODE" && act.lcProblemName 
                            ? `Solved ${act.lcProblemName}`
                            : act.type === "CODEFORCES" && act.cfContestId
                            ? `Participated in Contest #${act.cfContestId}`
                            : act.notes || "Completed an activity"}
                        </p>
                        <p className="text-xs text-on-surface-variant font-label-mono mt-0.5">
                          {new Date(act.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface border border-outline rounded-xl p-5 shadow-panel">
              <h2 className="font-label-mono text-xs font-bold tracking-wider uppercase text-on-surface-variant mb-4 flex items-center justify-between">
                <span>Earned Badges</span>
              </h2>
              {user.userBadges.length === 0 ? (
                <div className="text-sm text-on-surface-variant py-4 text-center border border-dashed border-outline rounded-lg bg-surface-container-lowest">
                  No badges earned yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {user.userBadges.map((ub) => {
                    const badgeDef = Object.values(BADGE_DEFINITIONS).find(b => b.key === ub.badge.type);
                    if (!badgeDef) return null;
                    return (
                      <div key={ub.id} className="bg-surface-container-lowest border border-outline rounded-lg p-3 flex flex-col items-center text-center group hover:border-primary/50 transition-colors">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">{badgeDef.icon}</div>
                        <div className="text-xs font-bold text-on-background leading-tight">{badgeDef.name}</div>
                        <div className="text-[10px] text-on-surface-variant mt-1 leading-tight">{badgeDef.description}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}
        >
          <div className="bg-surface border border-outline rounded-xl w-full max-w-lg shadow-modal border-t-2 border-t-primary animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-outline">
              <h2 className="font-headline-lg-mobile text-on-background">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-on-surface-variant hover:text-[#EF4444] transition-colors p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {errorMsg && (
                <div className="bg-[#FEF2F2] border border-[#F87171] rounded-lg p-3 flex gap-2 text-sm text-[#991B1B]">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <p>{errorMsg}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-label-mono text-on-background mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-label-mono text-on-background mb-1">Profile Image</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 w-full sm:w-auto bg-surface-container border border-outline rounded text-sm text-on-background hover:border-primary transition-colors font-label-mono flex items-center justify-center gap-2 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    Upload Image
                  </button>
                  <span className="text-on-surface-variant text-xs font-label-mono hidden sm:inline">OR URL</span>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="w-full bg-surface-container border border-outline rounded p-2 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
                  />
                </div>
                {avatarUrl && (
                  <div className="mt-3 flex items-center gap-3 p-3 border border-outline/50 rounded-lg bg-surface-container-lowest">
                    <span className="text-xs text-on-surface-variant font-label-mono">Preview:</span>
                    <img src={avatarUrl} alt="Preview" className="w-12 h-12 rounded-full border border-outline object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-label-mono text-on-background mb-1">Codeforces Handle</label>
                <input
                  type="text"
                  value={cfHandle}
                  onChange={(e) => setCfHandle(e.target.value)}
                  placeholder="e.g. tourist"
                  className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-label-mono text-on-background mb-1">LeetCode Username</label>
                <input
                  type="text"
                  value={lcHandle}
                  onChange={(e) => setLcHandle(e.target.value)}
                  placeholder="e.g. neetcode"
                  className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-label-mono text-on-background mb-1">LinkedIn Username</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="e.g. johndoe"
                  className="w-full bg-surface-container border border-outline rounded p-3 text-sm text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-label-mono"
                />
              </div>

              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-lg p-4 flex gap-3 text-sm text-[#92400E]">
                <span className="material-symbols-outlined">info</span>
                <p>Linking accounts allows Grindboard to automatically track your problem-solving activities.</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-outline">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-surface border border-outline text-on-background hover:bg-surface-container rounded py-3 font-label-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 bg-primary text-white hover:bg-[#059669] rounded py-3 font-label-mono shadow-sm transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
