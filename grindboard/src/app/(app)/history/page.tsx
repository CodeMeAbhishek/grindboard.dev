import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CodeforcesIcon, LeetCodeIcon } from "@/components/icons/PlatformIcons";

export const dynamic = 'force-dynamic';

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) redirect("/login");

  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const [activities, totalCount] = await Promise.all([
    prisma.activity.findMany({
      where: { userId: dbUser.id, type: { in: ["LEETCODE", "CODEFORCES"] } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.activity.count({
      where: { userId: dbUser.id, type: { in: ["LEETCODE", "CODEFORCES"] } }
    })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-4xl mx-auto space-y-md pb-xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profile" className="p-2 bg-surface hover:bg-surface-container rounded-full transition-colors border border-outline flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-md text-on-background tracking-tight">Full Activity History</h1>
          <p className="text-on-surface-variant text-sm font-label-mono">
            {totalCount} total solved problems
          </p>
        </div>
      </div>

      <div className="bg-surface border border-outline shadow-panel rounded-xl overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-xl text-center text-on-surface-variant">
            No activity found yet. Go solve some problems!
          </div>
        ) : (
          <div className="flex flex-col">
            {activities.map(activity => (
              <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-md border-b border-outline last:border-b-0 hover:bg-surface-container/50 transition-colors">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-surface-container border border-outline shrink-0">
                    {activity.type === "LEETCODE" ? <LeetCodeIcon className="w-6 h-6" /> : <CodeforcesIcon className="w-6 h-6" />}
                  </div>
                  <div>
                    <a 
                      href={activity.type === "LEETCODE" 
                        ? `https://leetcode.com/problems/${activity.lcProblemName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                        : activity.cfContestId 
                          ? (activity.metadata as any)?.index 
                            ? `https://codeforces.com/contest/${activity.cfContestId}/problem/${(activity.metadata as any).index}`
                            : `https://codeforces.com/contest/${activity.cfContestId}`
                          : `https://codeforces.com/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-on-background font-medium hover:text-primary hover:underline transition-colors"
                    >
                      {activity.type === "LEETCODE" 
                        ? activity.lcProblemName 
                        : activity.notes || `Codeforces Problem`}
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.type === "LEETCODE" && activity.lcDifficulty && (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-label-mono uppercase ${
                          activity.lcDifficulty === 'EASY' ? 'bg-[#10B981]/10 text-[#10B981]' :
                          activity.lcDifficulty === 'MEDIUM' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                          'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}>
                          {activity.lcDifficulty}
                        </span>
                      )}
                      {activity.type === "CODEFORCES" && (activity.metadata as any)?.rating && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-label-mono bg-primary/10 text-primary">
                          Rating {(activity.metadata as any).rating}
                        </span>
                      )}
                      {activity.type === "CODEFORCES" && activity.cfContestId && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-label-mono bg-surface-container text-on-surface-variant border border-outline">
                          Contest {activity.cfContestId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end mt-4 sm:mt-0">

                  <span className="text-xs text-on-surface-variant mt-1">
                    {new Date(activity.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-md mt-6">
          <Link 
            href={page > 1 ? `/history?page=${page - 1}` : '#'}
            className={`px-4 py-2 rounded border font-label-mono text-sm transition-colors ${
              page > 1 
                ? "bg-surface border-outline text-on-background hover:bg-surface-container" 
                : "bg-surface-container/50 border-outline/50 text-on-surface-variant/50 cursor-not-allowed pointer-events-none"
            }`}
          >
            Previous
          </Link>
          <span className="font-label-mono text-sm text-on-surface-variant">
            Page {page} of {totalPages}
          </span>
          <Link 
            href={page < totalPages ? `/history?page=${page + 1}` : '#'}
            className={`px-4 py-2 rounded border font-label-mono text-sm transition-colors ${
              page < totalPages 
                ? "bg-surface border-outline text-on-background hover:bg-surface-container" 
                : "bg-surface-container/50 border-outline/50 text-on-surface-variant/50 cursor-not-allowed pointer-events-none"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
