"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/subjects", label: "Learn", icon: "menu_book" },
  { href: "/interviews", label: "Prep", icon: "work" },
  { href: "/feed", label: "Feed", icon: "dynamic_feed" },
  { href: "/leaderboard", label: "Rank", icon: "leaderboard" },
  { href: "/profile", label: "Profile", icon: "person" },
];

export function MobileNav() {
 const pathname = usePathname();

 return (
 <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center bg-surface border-t border-outline py-2 pb-safe">
 {mobileNavItems.map((item) => {
 const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
 return (
 <Link
 key={item.href}
 href={item.href}
 className={cn(
 "flex flex-col items-center gap-0.5 p-2 relative",
 isActive ? "text-primary" : "text-on-surface-variant hover:text-on-background"
 )}
 >
 {isActive && (
 <div className="absolute -top-0.5 w-8 h-0.5 bg-primary rounded-full" />
 )}
 <span
 className="material-symbols-outlined text-2xl"
 style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
 >
 {item.icon}
 </span>
 <span className="font-label-mono text-[10px] font-medium">{item.label}</span>
 </Link>
 );
 })}
 </nav>
 );
}
