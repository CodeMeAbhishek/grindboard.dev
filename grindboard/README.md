# Grindboard 🎯

A gamified group study tracker designed for friends preparing for GATE, Competitive Programming, LeetCode, DSA, Machine Learning, and Web Development. Grindboard acts as an accountability layer and progress tracker over external study platforms.

## Features ✨

*   **Gamified Tracking:** Earn XP, level up, and maintain streaks by logging your daily study activities.
*   **Module Management:** Enroll in specific subjects and track your progress against weekly goals.
*   **Leaderboard:** Compete with your friends on the global leaderboard ranked by XP, streaks, and problems solved.
*   **Events Radar:** Keep track of upcoming contests (Codeforces, LeetCode) and GATE mock tests, and log your past results.
*   **Activity Heatmap:** Visualize your consistency over the year in your profile.
*   **Admin Panel:** Manage users, modules, and broadcast announcements to the group.

## Tech Stack 🛠️

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (via Supabase)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Auth & Backend:** [Supabase](https://supabase.com/)

## Getting Started 🚀

### 1. Prerequisites
*   Node.js (v18 or higher)
*   A Supabase account/project

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your Supabase credentials:
```bash
cp .env.local.example .env.local
```
Update the following in `.env.local`:
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `DATABASE_URL`
*   `DIRECT_URL`

### 4. Database Setup
Push the Prisma schema to your database and seed it with initial data (modules, badges, admin user):
```bash
npm run db:push
npm run db:seed
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Gamification System 🎮

*   **XP System:** Different activities yield different XP (e.g., LeetCode Easy = +10 XP, Hard = +30 XP, Codeforces Div 2 = +40 XP).
*   **Levels:** Progress through 50 ranks, from "Novice" to "Grandmaster".
*   **Badges:** Unlock badges for milestones like First Blood, Streak Starter, and Century Club.

## License 📄
MIT License
