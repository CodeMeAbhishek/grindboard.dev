# Community Feed & CP Leaderboard Implementation Plan

This plan covers the transition of Grindboard from a personal progress tracker into a Codeforces-like community platform with social feeds, public discussions, and a competitive programming-focused leaderboard.

## Approved Plan Decisions

- **Leaderboard Ranking Logic**: Option A selected. We will build two separate tabs on the Leaderboard (one for Codeforces, one for LeetCode) to avoid mixing incomparable rating systems.
- **Profile Ratings Sync**: Ratings and global rankings will be synced via a background cron job that runs every 6 hours. The UI will mention "updates every 6 hrs".
- **Upcoming Contests**: Ensure both LeetCode and Codeforces upcoming contests are visible and fetched via the cron job.

## Proposed Changes

### 1. Database Schema (`prisma/schema.prisma`)
We will add new models to support the Codeforces-style social feed.

#### [MODIFY] schema.prisma
- **User Model Updates**: Add fields for `cfRating`, `cfMaxRating`, `lcRating`, `lcGlobalRanking`. Add relations to Posts, Comments, and Likes.
- **New `Post` Model**: To store community feed messages. Includes `id`, `userId`, `content`, `createdAt`.
- **New `Comment` Model**: To allow users to reply to posts. Includes `id`, `postId`, `userId`, `content`.
- **New `Like` Model**: To allow users to like posts. Includes `postId`, `userId`.

### 2. Header and Navigation Updates

#### [MODIFY] src/components/layout/Sidebar.tsx & Header.tsx
- Add a new `Home` link that points to the community feed (`/feed` or `/`).
- Add a `Leaderboard` link to the header.
- Remove the `Upcoming Contests` link from the header to make room.

### 3. Community Feed (The "Home" Page)

#### [NEW] src/app/(app)/feed/page.tsx & FeedClient.tsx
- Create a Codeforces-style public feed where users can post messages.
- Implement social features:
  - Create Post
  - Delete Post (if author)
  - Like/Unlike Post
  - Reply to Post (Comments)

#### [NEW] src/app/api/feed/... (Multiple Routes)
- `POST /api/feed` (Create post)
- `POST /api/feed/[id]/like` (Toggle like)
- `POST /api/feed/[id]/comment` (Add reply)
- `DELETE /api/feed/[id]` (Delete post)

### 4. Leaderboard Revamp

#### [MODIFY] src/app/(app)/leaderboard/page.tsx & LeaderboardClient.tsx
- Replace the current XP/Streak-based ranking logic.
- Fetch users based on their stored `cfRating` and `lcRating`.
- Display LeetCode and Codeforces badges, ratings, and global rankings in the leaderboard table.

### 5. Profile Updates

#### [MODIFY] src/app/(app)/profile/page.tsx & ProfileClient.tsx
- Update the profile UI to prominently display the user's fetched LeetCode and Codeforces rankings and ratings.

## Verification Plan

### Automated Tests
- No automated tests are strictly required, but Prisma schema validation will be run using `npx prisma generate` and `npx prisma db push`.

### Manual Verification
1. Open the app and verify the Header has the new navigation links.
2. Navigate to the Home/Feed page and test creating, liking, and deleting a post.
3. Reply to a post and ensure the comment appears instantly.
4. Go to the Leaderboard and verify it sorts users by their CP ratings rather than XP.
5. Check the Profile page to ensure CP ratings/rankings are fetched and displayed accurately.
