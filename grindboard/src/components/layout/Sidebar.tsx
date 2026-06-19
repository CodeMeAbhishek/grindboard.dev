"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", fillIcon: false },
  { href: "/subjects", label: "Subjects", icon: "book", fillIcon: false },
  { href: "/goals", label: "Goals", icon: "target", fillIcon: false },
  { href: "/profile", label: "Profile", icon: "person", fillIcon: false },
];

const adminItem = {
 href: "/admin",
 label: "Admin Panel",
 icon: "admin_panel_settings",
 fillIcon: false,
};

interface SidebarProps {
  userRole?: "ADMIN" | "MEMBER";
  userName?: string;
  userLevel?: string;
}

export function Sidebar({
  userRole = "MEMBER",
  userName,
  userLevel = "Beginner",
}: SidebarProps) {
 const pathname = usePathname();

 return (
 <aside className="hidden md:flex bg-surface fixed left-0 top-0 h-full flex-col z-40 border-r border-outline w-64">
 {/* Brand */}
 <div className="p-sm border-b border-outline">
 <h1 className="font-display-xl text-2xl font-black tracking-tighter text-primary leading-none">
 Grindboard
 </h1>
  {userName && (
    <p className="font-label-mono text-xs text-on-surface-variant mt-1">
      {userLevel} · {userName}
    </p>
  )}
 {!userName && (
 <p className="font-label-mono text-xs text-on-surface-variant mt-1">
 {userLevel}
 </p>
 )}
 </div>

 {/* Nav */}
 <nav className="flex-1 py-sm px-xs space-y-0.5 overflow-y-auto">
 {navItems.map((item) => {
 const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
 return (
 <Link
 key={item.href}
 href={item.href}
 className={cn(
 "flex items-center gap-3 py-3 px-4 font-label-mono text-label-mono transition-all rounded-lg",
 isActive
 ? "text-primary bg-[#F0FDF4] border-r-2 border-primary translate-x-0.5"
 : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
 )}
 >
 <span
 className="material-symbols-outlined text-xl"
 style={{
 fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
 }}
 >
 {item.icon}
 </span>
 {item.label}
 </Link>
 );
 })}

 {userRole === "ADMIN" && (
 <Link
 href={adminItem.href}
 className={cn(
 "flex items-center gap-3 py-3 px-4 font-label-mono text-label-mono transition-all rounded-lg mt-auto",
 pathname === adminItem.href
 ? "text-primary bg-[#F0FDF4] border-r-2 border-primary translate-x-0.5"
 : "text-on-surface-variant hover:text-on-background hover:bg-surface-container"
 )}
 >
 <span className="material-symbols-outlined text-xl">
 {adminItem.icon}
 </span>
 {adminItem.label}
 </Link>
 )}
 </nav>

 {/* Footer */}
 <div className="p-sm border-t border-outline">
 <button className="w-full border border-outline text-on-surface-variant font-label-mono text-xs py-2 rounded hover:text-primary hover:border-primary transition-colors">
 Upgrade to Pro
 </button>
 </div>
 </aside>
 );
}
