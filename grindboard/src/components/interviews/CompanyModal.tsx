"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CompanyData, CandidateData } from "@/app/(app)/interviews/InterviewsClient";
import { ExperienceViewer } from "./ExperienceViewer";

interface CompanyModalProps {
  company: CompanyData;
  onClose: () => void;
}

export function CompanyModal({ company, onClose }: CompanyModalProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateData>(
    company.candidates[0]
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when candidate changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedCandidate]);

  const [mounted, setMounted] = useState(false);

  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-outline shadow-2xl rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-outline bg-surface-container/50">
          <div>
            <h2 className="font-headline-md text-primary flex items-center gap-3">
              {company.company}
              <span className="text-sm font-label-mono text-on-surface-variant bg-surface px-2 py-1 rounded border border-outline">
                {company.role}
              </span>
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              {company.selection_process}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-surface-container border border-outline text-on-surface-variant hover:text-on-background transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body (Split Pane) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          
          {/* Left Sidebar / Top Bar - Candidate List */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-outline bg-surface-container/20 shrink-0">
            <div className="p-3 md:p-4 flex flex-col h-full">
              <h3 className="text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-3 px-2 hidden md:block">
                Candidates ({company.candidates.length})
              </h3>
              {/* Desktop vertical list, Mobile horizontal list */}
              <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto gap-2 md:space-y-1 md:gap-0 pb-1 md:pb-0 hide-scrollbar md:custom-scrollbar">
                {company.candidates.map((candidate, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`whitespace-nowrap md:whitespace-normal shrink-0 md:w-full text-left px-4 py-2 md:py-3 rounded-xl transition-all font-body-md text-sm flex items-center justify-between ${
                      selectedCandidate === candidate
                        ? "bg-primary text-on-primary font-medium shadow-md shadow-primary/20"
                        : "text-on-surface-variant hover:bg-surface hover:text-on-background border border-outline md:border-transparent bg-surface md:bg-transparent"
                    }`}
                  >
                    {candidate.candidate_label}
                    {selectedCandidate === candidate && (
                      <span className="material-symbols-outlined text-sm ml-2 hidden md:block">
                        chevron_right
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Area - Experience Details */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-surface p-6 sm:p-8"
          >
            <div className="max-w-3xl mx-auto">
              <ExperienceViewer candidate={selectedCandidate} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
