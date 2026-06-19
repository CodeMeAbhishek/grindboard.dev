"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { QuickLogModal } from "@/components/modals/QuickLogModal";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
 userId?: string;
 userAvatarUrl?: string;
 userName?: string;
}

interface Notification {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
  referenceId: string | null;
  actor: { name: string; avatarUrl: string | null; username: string | null };
}

export function Header({ userId, userAvatarUrl, userName }: HeaderProps) {
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "GB";

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications and subscribe
  useEffect(() => {
    if (!userId) return;

    fetch("/api/notifications").then(res => res.json()).then(data => {
      if (Array.isArray(data)) setNotifications(data);
    });

    const supabase = createClient();
    const channel = supabase.channel("public-feed");
    channel.on("broadcast", { event: "new_notification" }, (payload) => {
      if (payload.payload.userId === userId) {
        setNotifications(prev => [payload.payload, ...prev]);
      }
    }).subscribe();

    return () => { channel.unsubscribe(); };
  }, [userId]);

  const handleMarkAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (e) { console.error(e); }
  };

  // Handle search debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search/users?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

 return (
 <>
 <header className="hidden md:flex bg-surface/90 backdrop-blur-md fixed top-0 z-50 justify-between items-center px-sm py-base border-b border-outline h-16 w-[calc(100%-16rem)] ml-64 transition-colors">
 {/* Left: Search */}
      <div className="flex-1 max-w-xs" ref={searchRef}>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            className="w-full bg-surface border border-outline rounded py-1.5 pl-9 pr-3 text-sm font-label-mono text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
          />
          {isSearching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          )}

          {/* Search Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-surface border border-outline rounded-lg shadow-lg overflow-hidden z-50">
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      router.push(`/u/${user.id}`);
                      setShowDropdown(false);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-container transition-colors text-left border-b border-outline last:border-0"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-on-background truncate">{user.name}</div>
                      <div className="text-xs text-on-surface-variant font-label-mono truncate">
                        {user.username ? `@${user.username}` : "No username"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

 {/* Center: Navigation */}
  <nav className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
    <Link 
      href="/feed"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-label-mono transition-colors",
        pathname === "/feed" 
          ? "bg-primary/10 text-primary" 
          : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
      )}
    >
      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: pathname === "/feed" ? "'FILL' 1" : "'FILL' 0" }}>home</span>
      Home
    </Link>
    <Link 
      href="/contests"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-label-mono transition-colors",
        pathname === "/contests" 
          ? "bg-primary/10 text-primary" 
          : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
      )}
    >
      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: pathname === "/contests" ? "'FILL' 1" : "'FILL' 0" }}>calendar_today</span>
      Contests
    </Link>
    <Link 
      href="/leaderboard"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-label-mono transition-colors",
        pathname === "/leaderboard" 
          ? "bg-primary/10 text-primary" 
          : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
      )}
    >
      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: pathname === "/leaderboard" ? "'FILL' 1" : "'FILL' 0" }}>leaderboard</span>
      Leaderboard
    </Link>
  </nav>

 {/* Right: Actions */}
 <div className="flex items-center gap-sm">
 <ThemeToggle />
 
 <div className="relative" ref={notificationsRef}>
   <button 
     onClick={() => {
       setShowNotifications(!showNotifications);
       if (!showNotifications) handleMarkAsRead();
     }}
     className="text-on-surface-variant hover:text-primary transition-colors duration-200 p-2 relative"
   >
     <span className="material-symbols-outlined">notifications</span>
     {unreadCount > 0 && (
       <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
     )}
   </button>

   {showNotifications && (
     <div className="absolute right-0 mt-2 w-80 bg-surface border border-outline shadow-panel rounded-lg py-2 z-50 max-h-96 overflow-y-auto">
       <div className="px-4 py-2 border-b border-outline font-bold text-sm text-on-background">Notifications</div>
       {notifications.length === 0 ? (
         <div className="px-4 py-6 text-center text-sm text-on-surface-variant font-label-mono">No notifications yet.</div>
       ) : (
         notifications.map(notif => (
           <div key={notif.id} className="px-4 py-3 hover:bg-surface-container transition-colors border-b border-outline last:border-0 flex gap-3 cursor-pointer" onClick={() => { setShowNotifications(false); router.push("/feed"); }}>
             <div className="shrink-0 mt-1">
               {notif.actor.avatarUrl ? (
                 <img src={notif.actor.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
               ) : (
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{notif.actor.name[0]}</div>
               )}
             </div>
             <div>
               <div className="text-sm text-on-background">
                 <span className="font-bold">{notif.actor.name}</span>
                 {notif.type === "LIKE" && " liked your post."}
                 {notif.type === "COMMENT_ON_POST" && " commented on your post."}
                 {notif.type === "REPLY_ON_COMMENT" && " replied to your comment."}
               </div>
               <div className="text-xs text-on-surface-variant mt-1 font-label-mono">{new Date(notif.createdAt).toLocaleDateString()}</div>
             </div>
           </div>
         ))
       )}
     </div>
   )}
 </div>

 <button
 id="quick-log-btn"
 onClick={() => setShowQuickLog(true)}
 className="bg-primary text-white font-label-mono text-sm px-4 py-2 rounded hover:bg-[#059669] transition-colors flex items-center gap-1.5"
 >
 <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
 add_circle
 </span>
 Quick Log
 </button>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center focus:outline-none"
          >
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-outline object-cover cursor-pointer hover:border-primary transition-colors"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#F0FDF4] border border-primary/30 flex items-center justify-center text-xs font-label-mono text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                {initials}
              </div>
            )}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline shadow-panel rounded-lg py-1 z-50">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-on-background hover:bg-surface-container transition-colors font-label-mono"
                onClick={() => setShowProfileMenu(false)}
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
                View Profile
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-on-background hover:bg-surface-container transition-colors font-label-mono"
                onClick={() => setShowProfileMenu(false)}
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Settings
              </Link>
              <div className="h-px bg-outline my-1"></div>
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  handleSignOut();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-label-mono text-left"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
 </div>
 </header>

 {/* Mobile Top Nav */}
 <header className="md:hidden bg-surface/90 backdrop-blur-md fixed top-0 w-full z-50 flex justify-between items-center px-sm py-base border-b border-outline h-14">
 <span className="font-display-xl text-2xl font-black tracking-tighter text-primary leading-none">
 Grindboard
 </span>
 <div className="flex items-center gap-sm">
 <div className="relative">
   <button 
     onClick={() => {
       setShowNotifications(!showNotifications);
       if (!showNotifications) handleMarkAsRead();
     }}
     className="text-on-surface-variant hover:text-primary transition-colors duration-200 p-1 relative"
   >
     <span className="material-symbols-outlined">notifications</span>
     {unreadCount > 0 && (
       <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
     )}
   </button>

   {showNotifications && (
     <div className="absolute right-0 mt-2 w-72 bg-surface border border-outline shadow-panel rounded-lg py-2 z-50 max-h-80 overflow-y-auto">
       <div className="px-4 py-2 border-b border-outline font-bold text-sm text-on-background">Notifications</div>
       {notifications.length === 0 ? (
         <div className="px-4 py-6 text-center text-sm text-on-surface-variant font-label-mono">No notifications yet.</div>
       ) : (
         notifications.map(notif => (
           <div key={notif.id} className="px-4 py-3 hover:bg-surface-container transition-colors border-b border-outline last:border-0 flex gap-3 cursor-pointer" onClick={() => { setShowNotifications(false); router.push("/feed"); }}>
             <div className="shrink-0 mt-1">
               {notif.actor.avatarUrl ? (
                 <img src={notif.actor.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
               ) : (
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{notif.actor.name[0]}</div>
               )}
             </div>
             <div>
               <div className="text-sm text-on-background">
                 <span className="font-bold">{notif.actor.name}</span>
                 {notif.type === "LIKE" && " liked your post."}
                 {notif.type === "COMMENT_ON_POST" && " commented on your post."}
                 {notif.type === "REPLY_ON_COMMENT" && " replied to your comment."}
               </div>
               <div className="text-xs text-on-surface-variant mt-1 font-label-mono">{new Date(notif.createdAt).toLocaleDateString()}</div>
             </div>
           </div>
         ))
       )}
     </div>
   )}
 </div>
 <button
 onClick={() => setShowQuickLog(true)}
 className="bg-primary text-white font-label-mono text-xs px-3 py-1.5 rounded flex items-center gap-1 hover:bg-[#059669] transition-colors"
 >
 <span className="material-symbols-outlined text-sm">add</span>
 Quick Log
 </button>
 </div>
 </header>

 {showQuickLog && (
 <QuickLogModal onClose={() => setShowQuickLog(false)} />
 )}
 </>
 );
}
