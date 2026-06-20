"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { TopicGroup, TaggedQuestion } from "@/app/(app)/interviews/topicUtils";
import { QuestionCard } from "./ExperienceViewer";

interface TopicModalProps {
  topic: TopicGroup;
  onClose: () => void;
}

export function TopicModal({ topic, onClose }: TopicModalProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<TaggedQuestion>(
    topic.questions[0]
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when question changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedQuestion]);

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
              {topic.topicName}
              <span className="text-sm font-label-mono text-on-surface-variant bg-surface px-2 py-1 rounded border border-outline">
                {topic.count} Questions
              </span>
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Interview questions tagged with {topic.topicName}
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
          
          {/* Left Sidebar - Question List */}
          <div className="w-full md:w-80 border-r border-outline bg-surface-container/20 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-label-mono text-on-surface-variant uppercase tracking-wider mb-3 px-2">
                Questions ({topic.questions.length})
              </h3>
              <div className="space-y-2">
                {topic.questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedQuestion(q)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex flex-col gap-1 ${
                      selectedQuestion === q
                        ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                        : "text-on-surface-variant hover:bg-surface hover:text-on-background"
                    }`}
                  >
                    <span className={`text-xs font-label-mono ${selectedQuestion === q ? "text-on-primary/80" : "text-primary"}`}>
                      {q.companyName}
                    </span>
                    <span className={`font-body-md text-sm ${selectedQuestion === q ? "font-medium" : ""}`}>
                      {q.questionData.question_title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Area - Question Detail */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto bg-surface p-6 sm:p-8"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Context Header */}
              <div className="bg-surface-container/10 border border-outline/50 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-base">corporate_fare</span>
                  <span className="font-medium text-on-background">{selectedQuestion.companyName}</span>
                  <span>•</span>
                  <span className="material-symbols-outlined text-base">person</span>
                  <span>{selectedQuestion.candidateLabel}</span>
                  <span>•</span>
                  <span className="material-symbols-outlined text-base">psychology</span>
                  <span>{selectedQuestion.roundName}</span>
                </div>
              </div>

              {/* The Question Card */}
              <QuestionCard question={selectedQuestion.questionData} index={0} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
