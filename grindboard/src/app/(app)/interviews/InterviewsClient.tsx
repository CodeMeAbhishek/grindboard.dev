"use client";

import { useState, useMemo } from "react";
import { CompanyModal } from "@/components/interviews/CompanyModal";
import { TopicModal } from "@/components/interviews/TopicModal";
import { extractTopics, TopicGroup } from "./topicUtils";

export interface InterviewData {
  title: string;
  drive: string;
  note: string;
  companies: CompanyData[];
}

export interface CompanyData {
  company: string;
  role: string;
  stipend: string;
  number_of_selects: number;
  selection_process: string;
  candidates: CandidateData[];
}

export interface CandidateData {
  candidate_label: string;
  summary?: string;
  rounds?: RoundData[];
  questions?: QuestionData[]; // some candidates directly have questions
}

export interface RoundData {
  round_name: string;
  summary?: string;
  notes?: string;
  questions?: QuestionData[];
}

export interface QuestionData {
  question_title: string;
  question?: string;
  answer?: string;
  approach?: string;
  solution?: string;
  [key: string]: any; // for various other fields like complexity, follow_up, etc.
}

const COMPANY_LOGOS: Record<string, string> = {
  "Google": "/logos/google.png",
  "Sprinklr": "/logos/sprinklr.png",
  "Goldman Sachs": "/logos/gs.png",
  "Unify Apps": "/logos/unify.png",
  "Wells Fargo": "/logos/wf.png",
  "Obsidian Capital": "/logos/obsidian.png",
  "BNY": "/logos/bny.png",
  "BNY Mellon": "/logos/bny.png",
};

export default function InterviewsClient({ data }: { data: InterviewData }) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicGroup | null>(null);

  // Compute topics dynamically
  const topics = useMemo(() => extractTopics(data), [data]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <header className="space-y-2">
        <h1 className="font-headline-lg text-primary">{data.title}</h1>
        <p className="text-on-surface-variant font-body-md max-w-3xl">
          {data.note}
        </p>
      </header>

      {/* Companies Section */}
      <div className="space-y-6">
        <h2 className="font-headline-md text-on-background flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">corporate_fare</span>
          Company Wise Experiences
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.companies.map((company) => (
          <div
            key={company.company}
            onClick={() => setSelectedCompany(company)}
            className="bg-surface border border-outline shadow-panel hover:shadow-glow rounded-xl p-6 cursor-pointer transition-all group hover:border-primary/50 relative overflow-hidden flex flex-col h-full"
          >
            {/* Decorative gradient blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                {COMPANY_LOGOS[company.company] ? (
                  <img 
                    src={COMPANY_LOGOS[company.company]} 
                    alt={`${company.company} logo`} 
                    className="w-10 h-10 object-contain rounded-md bg-white p-1 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-surface-container flex items-center justify-center border border-outline">
                    <span className="material-symbols-outlined text-primary text-xl">corporate_fare</span>
                  </div>
                )}
                <h2 className="font-headline-md text-on-background group-hover:text-primary transition-colors">
                  {company.company}
                </h2>
              </div>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-mono text-xs font-bold whitespace-nowrap ml-2">
                {company.number_of_selects} Selects
              </div>
            </div>

            <div className="space-y-3 flex-1 relative z-10">
              <div>
                <p className="text-xs text-on-surface-variant font-label-mono uppercase tracking-wider mb-1">
                  Role
                </p>
                <p className="font-body-md text-on-background">{company.role}</p>
              </div>

              <div>
                <p className="text-xs text-on-surface-variant font-label-mono uppercase tracking-wider mb-1">
                  Stipend
                </p>
                <p className="font-body-md text-on-background">{company.stipend}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-outline flex items-center justify-between text-sm relative z-10">
              <span className="text-on-surface-variant font-label-mono">
                {company.candidates.length} Experiences
              </span>
              <span className="material-symbols-outlined text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Topics / Subjects Section */}
      <div className="space-y-6 pt-8 border-t border-outline/30">
        <h2 className="font-headline-md text-on-background flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">category</span>
          Subject Wise Questions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.topicName}
              onClick={() => setSelectedTopic(topic)}
              className="bg-surface border border-outline shadow-sm hover:shadow-glow rounded-xl p-5 cursor-pointer transition-all group hover:border-primary/50 text-left flex flex-col justify-between h-32 relative overflow-hidden"
            >
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <h3 className="font-headline-sm text-on-background group-hover:text-primary transition-colors relative z-10">
                {topic.topicName}
              </h3>
              
              <div className="flex items-center justify-between text-sm relative z-10">
                <span className="text-on-surface-variant font-label-mono">
                  {topic.count} Questions
                </span>
                <span className="material-symbols-outlined text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  arrow_forward
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </div>
  );
}
