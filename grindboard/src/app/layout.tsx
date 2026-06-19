import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
 title: "Grindboard — Gamified Group Study Tracker",
 description:
 "Track your GATE, CP, LeetCode, DSA, ML, and Web Dev progress with friends. Earn XP, build streaks, and climb the leaderboard.",
 keywords: ["study tracker", "GATE", "LeetCode", "Codeforces", "gamified", "DSA"],
 openGraph: {
 title: "Grindboard",
 description: "Gamified group study tracker for competitive programmers",
 type: "website",
 },
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="en" suppressHydrationWarning>
 <head>
 <link
 href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
 rel="stylesheet"
 />
 <link
 href="https://fonts.googleapis.com/css2?family=Geist:wght@400;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
 rel="stylesheet"
 />
 </head>
 <body className="bg-background text-on-background transition-colors">
 <ThemeProvider
 attribute="class"
 defaultTheme="system"
 enableSystem
 disableTransitionOnChange
 >
 {children}
 </ThemeProvider>
 </body>
 </html>
 );
}
