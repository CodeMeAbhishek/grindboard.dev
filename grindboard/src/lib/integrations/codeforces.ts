export interface CFSubmission {
 id: number;
 contestId: number;
 creationTimeSeconds: number;
 problem: {
 contestId: number;
 index: string;
 name: string;
 rating?: number;
 tags: string[];
 };
 verdict: string;
}

export interface CFContest {
 id: number;
 name: string;
 type: string;
 phase: string;
 frozen: boolean;
 durationSeconds: number;
 startTimeSeconds: number;
 relativeTimeSeconds: number;
}

const CF_API = "https://codeforces.com/api";

export async function validateCFHandle(handle: string): Promise<boolean> {
 try {
 const res = await fetch(`${CF_API}/user.info?handles=${handle}`);
 const data = await res.json();
 return data.status === "OK";
 } catch (error) {
 return false;
 }
}

export async function getCFUserInfo(handle: string): Promise<{ rating: number; maxRating: number; rank: string } | null> {
  try {
    const res = await fetch(`${CF_API}/user.info?handles=${handle}`);
    const data = await res.json();
    if (data.status === "OK" && data.result.length > 0) {
      const u = data.result[0];
      return {
        rating: u.rating || 0,
        maxRating: u.maxRating || 0,
        rank: u.rank || "unrated"
      };
    }
  } catch (error) {
    console.error(`Error fetching CF info for ${handle}:`, error);
  }
  return null;
}

export async function getCFRating(handle: string): Promise<number | null> {
  const info = await getCFUserInfo(handle);
  return info?.rating || null;
}

export async function getCFRecentSubmissions(handle: string, count: number = 20): Promise<CFSubmission[]> {
 try {
 const res = await fetch(`${CF_API}/user.status?handle=${handle}&from=1&count=${count}`);
 const data = await res.json();
 if (data.status === "OK") {
 return data.result;
 }
 } catch (error) {
 console.error(`Error fetching CF submissions for ${handle}:`, error);
 }
 return [];
}

export async function getCFTotalSolved(handle: string): Promise<number> {
  try {
    // Fetch all submissions without limit
    const res = await fetch(`${CF_API}/user.status?handle=${handle}`);
    const data = await res.json();
    if (data.status === "OK") {
      // Filter accepted submissions and count unique problems
      const uniqueProblems = new Set(
        data.result
          .filter((s: CFSubmission) => s.verdict === "OK" && s.problem && s.problem.contestId)
          .map((s: CFSubmission) => `${s.problem.contestId}${s.problem.index}`)
      );
      return uniqueProblems.size;
    }
  } catch (error) {
    console.error(`Error fetching total CF solved for ${handle}:`, error);
  }
  return 0;
}

export async function getCFUpcomingContests(): Promise<CFContest[]> {
 try {
 const res = await fetch(`${CF_API}/contest.list`);
 const data = await res.json();
 if (data.status === "OK") {
 return data.result.filter((c: CFContest) => c.phase === "BEFORE");
 }
 } catch (error) {
 console.error(`Error fetching CF contests:`, error);
 }
 return [];
}
