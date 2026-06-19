export interface LCSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

export interface LCContest {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
}

const LC_GRAPHQL = "https://leetcode.com/graphql";

export async function validateLCHandle(handle: string): Promise<boolean> {
  try {
    const res = await fetch(LC_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: `
          query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
              username
            }
          }
        `,
        variables: { username: handle }
      })
    });
    const data = await res.json();
    return !!data?.data?.matchedUser;
  } catch (error) {
    return false;
  }
}

export async function getLCRecentSubmissions(handle: string, limit: number = 20): Promise<LCSubmission[]> {
  try {
    const res = await fetch(LC_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: `
          query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
              id
              title
              titleSlug
              timestamp
            }
          }
        `,
        variables: { username: handle, limit }
      })
    });
    const data = await res.json();
    return data?.data?.recentAcSubmissionList || [];
  } catch (error) {
    console.error(`Error fetching LC submissions for ${handle}:`, error);
  }
  return [];
}

export async function getLCUpcomingContests(): Promise<LCContest[]> {
  // Using alfa-leetcode-api endpoint or a direct GraphQL query
  // For simplicity, we can query GraphQL for the top upcoming contests
  try {
    const res = await fetch(LC_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: `
          query upcomingContests {
            topTwoContests {
              title
              titleSlug
              startTime
              duration
            }
          }
        `
      })
    });
    const data = await res.json();
    return data?.data?.topTwoContests || [];
  } catch (error) {
    console.error(`Error fetching LC contests:`, error);
  }
  return [];
}

export async function getLCProblemDifficulty(titleSlug: string): Promise<"EASY" | "MEDIUM" | "HARD" | null> {
  try {
    const res = await fetch(LC_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: `
          query questionTitle($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              difficulty
            }
          }
        `,
        variables: { titleSlug }
      })
    });
    const data = await res.json();
    const diff = data?.data?.question?.difficulty?.toUpperCase();
    if (diff === "EASY" || diff === "MEDIUM" || diff === "HARD") return diff;
  } catch (error) {
    console.error(`Error fetching LC difficulty for ${titleSlug}:`, error);
  }
  return null;
}
