import { InterviewData, QuestionData, CompanyData, CandidateData } from "./InterviewsClient";

export interface TopicGroup {
  topicName: string;
  count: number;
  questions: TaggedQuestion[];
}

export interface TaggedQuestion {
  companyName: string;
  candidateLabel: string;
  roundName: string;
  questionData: QuestionData;
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "Dynamic Programming": ["dp", "dynamic programming", "memoization", "tabulation", "knapsack"],
  "Graphs": ["graph", "bfs", "dfs", "dijkstra", "shortest path", "topological sort", "islands"],
  "Trees": ["tree", "binary search tree", "bst", "lca", "trie", "segment tree"],
  "Arrays & Strings": ["array", "string", "two pointers", "sliding window", "subarray", "palindrome", "anagram"],
  "Math & Bit Manipulation": ["math", "bit manipulation", "bitwise", "xor", "gcd", "prime"],
  "Sorting & Searching": ["sort", "binary search", "merge sort", "quick sort"],
  "System Design": ["system design", "design a", "scalability", "architecture", "microservices"],
  "Computer Networks": ["network", "tcp", "udp", "osi", "http"],
  "Operating Systems": ["os", "operating system", "thread", "process", "mutex", "semaphore", "deadlock"],
  "DBMS & SQL": ["dbms", "sql", "database", "query", "acid", "join", "index"],
};

export function extractTopics(data: InterviewData): TopicGroup[] {
  const topicMap: Record<string, TaggedQuestion[]> = {};

  // Initialize empty arrays
  Object.keys(TOPIC_KEYWORDS).forEach((key) => {
    topicMap[key] = [];
  });
  topicMap["Miscellaneous"] = [];

  // Traverse the data
  data.companies.forEach((company) => {
    company.candidates.forEach((candidate) => {
      // Questions directly under candidate
      if (candidate.questions) {
        candidate.questions.forEach((q) => {
          tagQuestion(q, company.company, candidate.candidate_label, "General Round", topicMap);
        });
      }

      // Questions under rounds
      if (candidate.rounds) {
        candidate.rounds.forEach((round) => {
          if (round.questions) {
            round.questions.forEach((q) => {
              tagQuestion(q, company.company, candidate.candidate_label, round.round_name, topicMap);
            });
          }
        });
      }
    });
  });

  // Convert to array and filter out empty topics
  const topics: TopicGroup[] = Object.keys(topicMap)
    .filter((key) => topicMap[key].length > 0)
    .map((key) => ({
      topicName: key,
      count: topicMap[key].length,
      questions: topicMap[key],
    }))
    .sort((a, b) => b.count - a.count); // Sort by most questions

  return topics;
}

function tagQuestion(
  q: QuestionData,
  companyName: string,
  candidateLabel: string,
  roundName: string,
  topicMap: Record<string, TaggedQuestion[]>
) {
  const textToSearch = `${q.question_title} ${q.question || ""} ${q.approach || ""} ${q.answer || ""}`.toLowerCase();
  
  let matched = false;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    // Check if any keyword matches
    const hasMatch = keywords.some((kw) => {
      // Regex word boundary to avoid partial matches like "drop" matching "dp" 
      // (Wait, dp is 2 letters, regex \b prevents that. But let's keep it simple with boundaries)
      const regex = new RegExp(`\\b${kw}\\b`, "i");
      return regex.test(textToSearch);
    });

    if (hasMatch) {
      topicMap[topic].push({ companyName, candidateLabel, roundName, questionData: q });
      matched = true;
    }
  }

  // If no topics matched, put it in Miscellaneous
  if (!matched) {
    topicMap["Miscellaneous"].push({ companyName, candidateLabel, roundName, questionData: q });
  }
}
