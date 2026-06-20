"use client";

import Link from "next/link";

export default function ProPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-4 text-center animate-fade-in">
      {/* Decorative Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="w-24 h-24 bg-surface border border-outline rounded-2xl flex items-center justify-center shadow-glow relative z-10">
          <span className="material-symbols-outlined text-5xl text-primary">workspace_premium</span>
        </div>
      </div>

      {/* Content */}
      <h1 className="font-display-xl text-4xl sm:text-5xl md:text-6xl text-on-background mb-4">
        Grindboard <span className="text-primary font-black">PRO</span>
      </h1>
      
      <p className="text-on-surface-variant font-body-lg max-w-lg mb-8 text-lg sm:text-xl">
        We're working hard to bring you exclusive features like mock interviews, advanced analytics, and 1-on-1 mentorship. 
      </p>

      <div className="inline-flex items-center gap-3 bg-surface-container border border-outline px-6 py-3 rounded-full mb-12">
        <span className="material-symbols-outlined text-primary animate-pulse">schedule</span>
        <span className="font-label-mono text-sm tracking-widest uppercase text-on-background">Coming Soon</span>
      </div>

      {/* Back Button */}
      <Link 
        href="/dashboard"
        className="text-primary hover:text-on-background font-label-mono text-sm flex items-center gap-2 transition-colors border-b border-transparent hover:border-on-background pb-1"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Return to Dashboard
      </Link>
    </div>
  );
}
