"use client";

import { useState } from "react";
import Link from "next/link";
import { QuickLogModal } from "@/components/modals/QuickLogModal";

interface HeaderProps {
  userAvatarUrl?: string;
  userName?: string;
}

export function Header({ userAvatarUrl, userName }: HeaderProps) {
  const [showQuickLog, setShowQuickLog] = useState(false);
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "GB";

  return (
    <>
      <header className="hidden md:flex bg-white/90 backdrop-blur-md fixed top-0 z-50 justify-between items-center px-sm py-base border-b border-[#E5E5E5] h-16 w-[calc(100%-16rem)] ml-64">
        {/* Left: Search */}
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white border border-[#E5E5E5] rounded py-1.5 pl-9 pr-3 text-sm font-label-mono text-[#1A1A1A] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#6B7280]"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-sm">
          <button className="text-[#6B7280] hover:text-primary transition-colors duration-200 p-2 relative">
            <span className="material-symbols-outlined">notifications</span>
          </button>

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

          <Link href="/profile">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-[#E5E5E5] object-cover cursor-pointer hover:border-primary transition-colors"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#F0FDF4] border border-primary/30 flex items-center justify-center text-xs font-label-mono text-primary cursor-pointer">
                {initials}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Top Nav */}
      <header className="md:hidden bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 flex justify-between items-center px-sm py-base border-b border-[#E5E5E5] h-14">
        <span className="font-display-xl text-2xl font-black tracking-tighter text-primary leading-none">
          Grindboard
        </span>
        <div className="flex items-center gap-sm">
          <button className="text-[#6B7280] hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
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
