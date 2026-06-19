"use client";

import { useState } from "react";
import { XP_VALUES } from "@/lib/gamification";

interface QuickLogModalProps {
  onClose: () => void;
}

const MODULES = [
  "Competitive Programming",
  "LeetCode DSA",
  "GATE Preparation",
  "Machine Learning",
  "DSA",
  "Web Development",
];

type ActivityType = "LEETCODE" | "CODEFORCES" | "STUDY" | "GATE_MOCK" | "TOPIC_COMPLETE";

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "LEETCODE", label: "LeetCode Problem" },
  { value: "CODEFORCES", label: "Codeforces Contest" },
  { value: "STUDY", label: "Study Session" },
  { value: "GATE_MOCK", label: "GATE Mock Test" },
  { value: "TOPIC_COMPLETE", label: "Topic Completed" },
];

export function QuickLogModal({ onClose }: QuickLogModalProps) {
  const [type, setType] = useState<ActivityType>("LEETCODE");
  const [module, setModule] = useState(MODULES[0]);
  const [lcDifficulty, setLcDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [lcProblem, setLcProblem] = useState("");
  const [cfRating, setCfRating] = useState("1800");
  const [studyHours, setStudyHours] = useState("1");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const xpPreview = (() => {
    if (type === "LEETCODE") {
      const map = { EASY: XP_VALUES.LC_EASY, MEDIUM: XP_VALUES.LC_MEDIUM, HARD: XP_VALUES.LC_HARD };
      return map[lcDifficulty];
    }
    if (type === "CODEFORCES") return XP_VALUES.CF_DIV3_DIV4;
    if (type === "STUDY") return Math.round(parseFloat(studyHours || "0") * XP_VALUES.STUDY_HOUR);
    if (type === "GATE_MOCK") return XP_VALUES.GATE_MOCK;
    if (type === "TOPIC_COMPLETE") return XP_VALUES.TOPIC_COMPLETE;
    return 0;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = { type, moduleId: null, notes };
      if (type === "LEETCODE") {
        body.lcDifficulty = lcDifficulty;
        body.lcProblemName = lcProblem;
      } else if (type === "CODEFORCES") {
        body.cfRating = parseInt(cfRating);
      } else if (type === "STUDY") {
        body.studyHours = parseFloat(studyHours);
      }

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-[#E5E5E5] rounded-xl w-full max-w-md shadow-modal border-t-2 border-t-primary animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#E5E5E5]">
          <h2 className="font-headline-lg-mobile text-[#1A1A1A]">Log Activity</h2>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#EF4444] transition-colors p-1"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-primary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <p className="font-headline-lg-mobile text-[#1A1A1A]">+{xpPreview} XP Earned!</p>
            <p className="text-[#6B7280] text-sm mt-1 font-label-mono">Activity logged successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Activity Type */}
            <div>
              <label className="block font-label-mono text-xs text-[#6B7280] uppercase mb-1.5">
                Activity Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="input-base"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Module */}
            <div>
              <label className="block font-label-mono text-xs text-[#6B7280] uppercase mb-1.5">
                Subject
              </label>
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="input-base"
              >
                {MODULES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Type-specific fields */}
            {type === "LEETCODE" && (
              <>
                <div>
                  <label className="block font-label-mono text-xs text-[#6B7280] uppercase mb-1.5">
                    Difficulty
                  </label>
                  <div className="flex gap-2">
                    {(["EASY", "MEDIUM", "HARD"] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setLcDifficulty(d)}
                        className={`flex-1 py-2 rounded text-xs font-label-mono border transition-all ${
                          lcDifficulty === d
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-[#6B7280] border-[#E5E5E5] hover:border-primary"
                        }`}
                      >
                        {d} (+{d === "EASY" ? XP_VALUES.LC_EASY : d === "MEDIUM" ? XP_VALUES.LC_MEDIUM : XP_VALUES.LC_HARD} XP)
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-label-mono text-xs text-[#6B7280] uppercase mb-1.5">
                    Problem Name (optional)
                  </label>
                  <input
                    type="text"
                    value={lcProblem}
                    onChange={(e) => setLcProblem(e.target.value)}
                    className="input-base"
                    placeholder="e.g., Two Sum"
                  />
                </div>
              </>
            )}

            {type === "CODEFORCES" && (
              <div>
                <label className="block font-label-mono text-xs text-[#6B7280] uppercase mb-1.5">
                  Your Rating / Division
                </label>
                <input
                  type="number"
                  value={cfRating}
                  onChange={(e) => setCfRating(e.target.value)}
                  className="input-base"
                  placeholder="e.g., 1800"
                />
              </div>
            )}

            {type === "STUDY" && (
              <div>
                <label className="block font-label-mono text-xs text-[#6B7280] uppercase mb-1.5">
                  Hours Studied
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="12"
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  className="input-base"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block font-label-mono text-xs text-[#6B7280] uppercase mb-1.5">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-base h-20 resize-none"
                placeholder="Key takeaways..."
              />
            </div>

            {/* XP Preview */}
            <div className="flex items-center justify-between bg-[#F0FDF4] border border-primary/20 rounded px-4 py-3">
              <span className="font-label-mono text-sm text-[#6B7280]">XP Preview</span>
              <span className="font-stat-lg text-primary">+{xpPreview} XP</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-[#E5E5E5] text-[#6B7280] rounded font-label-mono text-sm hover:bg-[#FAFAFA] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white py-2 rounded font-label-mono text-sm hover:bg-[#059669] transition-colors disabled:opacity-50"
              >
                {submitting ? "Logging..." : "Log Activity"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
