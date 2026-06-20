"use client";

import { CandidateData, RoundData, QuestionData } from "@/app/(app)/interviews/InterviewsClient";

export function ExperienceViewer({ candidate }: { candidate: CandidateData }) {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <header className="border-b border-outline pb-6">
        <h2 className="font-headline-lg text-on-background mb-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">person</span>
          {candidate.candidate_label}
        </h2>
        {candidate.summary && (
          <div className="bg-surface-container/50 border-l-4 border-primary p-4 rounded-r-lg text-on-surface font-body-md leading-relaxed">
            {candidate.summary}
          </div>
        )}
      </header>

      {/* Render explicit rounds if available */}
      {candidate.rounds && candidate.rounds.length > 0 && (
        <div className="space-y-8">
          {candidate.rounds.map((round, rIdx) => (
            <RoundSection key={rIdx} round={round} />
          ))}
        </div>
      )}

      {/* Render top-level questions if rounds aren't explicit */}
      {candidate.questions && candidate.questions.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-headline-md text-primary border-b border-outline/50 pb-2">
            Questions
          </h3>
          {candidate.questions.map((q, qIdx) => (
            <QuestionCard key={qIdx} question={q} index={qIdx} />
          ))}
        </div>
      )}
    </div>
  );
}

function RoundSection({ round }: { round: RoundData }) {
  return (
    <section className="bg-surface-container/10 border border-outline/50 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-surface-container/40 px-6 py-4 border-b border-outline/50 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">psychology</span>
        <h3 className="font-headline-md text-on-background">{round.round_name}</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {round.summary && (
          <p className="text-on-surface-variant font-body-md italic">{round.summary}</p>
        )}
        {round.notes && (
          <p className="text-on-surface-variant font-body-md">{round.notes}</p>
        )}

        {round.questions && round.questions.length > 0 ? (
          <div className="space-y-6 mt-4">
            {round.questions.map((q, idx) => (
              <QuestionCard key={idx} question={q} index={idx} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant opacity-70">No specific questions recorded for this round.</p>
        )}
      </div>
    </section>
  );
}

export function QuestionCard({ question, index }: { question: QuestionData; index: number }) {
  // Extract custom fields (e.g., complexity, outcome, hints) dynamically
  const customFields = Object.keys(question).filter(
    (k) => !["question_title", "question", "answer", "approach", "solution"].includes(k)
  );

  return (
    <div className="border border-outline/30 rounded-xl p-6 bg-surface shadow-sm hover:shadow-md hover:border-primary/40 transition-all relative">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/30 rounded-l-xl" />
      
      <h4 className="font-headline-md text-on-background mb-4 flex gap-2 items-start">
        <span className="text-primary font-label-mono mt-1">Q{index + 1}.</span>
        <span>{question.question_title}</span>
      </h4>

      {question.question && (
        <div className="bg-surface-container/30 p-5 rounded-lg mb-6 text-on-surface font-body-md whitespace-pre-wrap leading-relaxed border border-outline/20">
          {question.question}
        </div>
      )}

      <div className="space-y-6">
        {question.approach && (
          <div>
            <h5 className="text-xs font-label-mono text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">lightbulb</span>
              Approach
            </h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {question.approach}
            </p>
          </div>
        )}

        {question.solution && (
          <div>
            <h5 className="text-xs font-label-mono text-[#10B981] uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Solution
            </h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {question.solution}
            </p>
          </div>
        )}

        {question.answer && (
          <div>
            <h5 className="text-xs font-label-mono text-[#10B981] uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              Answer
            </h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {question.answer}
            </p>
          </div>
        )}

        {/* Render any additional fields dynamically */}
        {customFields.length > 0 && (
          <div className="pt-5 mt-5 border-t border-outline/30 grid gap-4 sm:grid-cols-2">
            {customFields.map((field) => (
              <div key={field} className="bg-surface-container/20 p-4 rounded-xl border border-outline/10">
                <h5 className="text-[10px] font-label-mono text-primary uppercase tracking-widest mb-2 font-bold">
                  {field.replace(/_/g, " ")}
                </h5>
                <div className="text-sm leading-relaxed text-on-surface">
                  <NestedFieldRenderer data={question[field]} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Recursive component to render unknown objects/arrays cleanly
function NestedFieldRenderer({ data }: { data: any }) {
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return <span className="whitespace-pre-wrap">{String(data)}</span>;
  }
  
  if (Array.isArray(data)) {
    return (
      <ul className="list-disc pl-5 space-y-1 mt-1">
        {data.map((item, i) => (
          <li key={i}>
            <NestedFieldRenderer data={item} />
          </li>
        ))}
      </ul>
    );
  }
  
  if (typeof data === "object" && data !== null) {
    return (
      <div className="space-y-3 mt-1">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-3">
            <span className="font-semibold text-on-background capitalize min-w-[80px]">
              {key.replace(/_/g, " ")}:
            </span>
            <span className="text-on-surface-variant flex-1">
              <NestedFieldRenderer data={val} />
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
}
