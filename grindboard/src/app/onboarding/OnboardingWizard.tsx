"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CodeforcesIcon, LeetCodeIcon, LinkedInIcon } from "@/components/icons/PlatformIcons";

type Step = 1 | 2 | 3;

export default function OnboardingWizard({ initialName }: { initialName: string }) {
 const router = useRouter();
 const [step, setStep] = useState<Step>(1);
 const [name, setName] = useState(initialName);
 const [username, setUsername] = useState("");
 const [selectedPath, setSelectedPath] = useState<string>("");
 const [cfHandle, setCfHandle] = useState("");
 const [lcHandle, setLcHandle] = useState("");
 const [linkedin, setLinkedin] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");

 const paths = [
 { id: "CP", title: "Competitive Programming", icon: "code", desc: "Codeforces, CodeChef, ICPC" },
 { id: "LEETCODE", title: "Interview Prep", icon: "terminal", desc: "LeetCode, DSA, System Design" },
 { id: "GATE", title: "GATE Prep", icon: "school", desc: "Computer Science GATE syllabus" },
 { id: "WEBDEV", title: "Web Development", icon: "web", desc: "React, Next.js, Backend" },
 ];

 const handleNext = () => {
 if (step === 1) {
 if (!name.trim()) return setError("Name is required");
 if (!username.trim()) return setError("Username is required");
 if (!/^[a-zA-Z0-9_]+$/.test(username)) return setError("Username can only contain letters, numbers, and underscores");
 }
 if (step === 2 && !selectedPath) return setError("Please select a path");
 setError("");
 setStep((s) => (s + 1) as Step);
 };

 const handleComplete = async () => {
 if (!cfHandle.trim() && !lcHandle.trim()) {
 return setError("Please provide at least one handle (Codeforces or LeetCode) to track your progress.");
 }

 if (linkedin.trim() && !/^[a-zA-Z0-9-]+$/.test(linkedin.trim())) {
 return setError("Invalid LinkedIn username. It should only contain letters, numbers, and dashes.");
 }

 setIsLoading(true);
 setError("");

 try {
 const res = await fetch("/api/onboarding/complete", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ name, username, selectedPath, cfHandle, lcHandle, linkedin }),
 });

 if (!res.ok) {
 const data = await res.json();
 throw new Error(data.error || "Failed to complete onboarding");
 }

 // Success! Redirect to dashboard
 window.location.href = "/feed";
 } catch (err: any) {
 setError(err.message);
 setIsLoading(false);
 }
 };

 return (
 <div className="bg-surface border border-outline rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-colors">
 {/* Progress Bar */}
 <div className="absolute top-0 left-0 h-1 bg-black/10 dark:bg-surface/10 w-full">
 <div 
 className="h-full bg-emerald-500 transition-all duration-500"
 style={{ width: `${(step / 3) * 100}%` }}
 />
 </div>

 <div className="mb-8 text-center">
 <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-500/20">
 <span className="material-symbols-outlined text-3xl text-white">track_changes</span>
 </div>
 <h1 className="text-3xl font-bold text-on-background tracking-tight transition-colors">Welcome to Grindboard</h1>
 <p className="text-on-surface-variant mt-2 transition-colors">Let's set up your profile</p>
 </div>

 {error && (
 <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
 <span className="material-symbols-outlined text-lg">error</span>
 {error}
 </div>
 )}

 {/* STEP 1 */}
 {step === 1 && (
 <div className="animate-in fade-in slide-in-from-right-4 duration-500">
 <h2 className="text-xl font-semibold mb-6 text-on-background ">What should we call you?</h2>
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-2">Full Name</label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="w-full bg-background border border-outline rounded-xl px-4 py-3 text-on-background focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
 placeholder="Your preferred name"
 />
 </div>
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-2">Unique Username</label>
 <div className="relative flex items-center">
 <span className="absolute left-4 text-gray-500 font-mono">@</span>
 <input
 type="text"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="w-full bg-background border border-outline rounded-xl pl-9 pr-4 py-3 text-on-background focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
 placeholder="cool_coder"
 />
 </div>
 </div>
 <button
 onClick={handleNext}
 className="w-full bg-black dark:bg-surface text-white font-semibold rounded-xl px-4 py-3 hover:opacity-80 transition-opacity mt-4"
 >
 Continue
 </button>
 </div>
 </div>
 )}

 {/* STEP 2 */}
 {step === 2 && (
 <div className="animate-in fade-in slide-in-from-right-4 duration-500">
 <h2 className="text-xl font-semibold mb-6 text-on-background ">Choose your primary focus</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {paths.map((path) => (
 <button
 key={path.id}
 onClick={() => setSelectedPath(path.id)}
 className={`p-4 rounded-xl border text-left transition-all ${
 selectedPath === path.id
 ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10"
 : "border-outline bg-background hover:border-gray-300 "
 }`}
 >
 <span className={`material-symbols-outlined text-2xl mb-2 ${selectedPath === path.id ? "text-emerald-500 dark:text-emerald-400" : "text-gray-400"}`}>
 {path.icon}
 </span>
 <h3 className="font-semibold text-on-background ">{path.title}</h3>
 <p className="text-xs text-on-surface-variant mt-1">{path.desc}</p>
 </button>
 ))}
 </div>
 <div className="flex gap-3 mt-8">
 <button
 onClick={() => setStep(1)}
 className="px-6 py-3 rounded-xl border border-outline text-on-surface-variant hover:bg-gray-50 dark:hover:bg-surface/5 transition-colors"
 >
 Back
 </button>
 <button
 onClick={handleNext}
 className="flex-1 bg-black dark:bg-surface text-white font-semibold rounded-xl px-4 py-3 hover:opacity-80 transition-opacity"
 >
 Continue
 </button>
 </div>
 </div>
 )}

 {/* STEP 3 */}
 {step === 3 && (
 <div className="animate-in fade-in slide-in-from-right-4 duration-500">
 <h2 className="text-xl font-semibold mb-2 text-on-background ">Link your accounts</h2>
 <p className="text-on-surface-variant text-sm mb-6">Provide at least one handle to automatically track your progress.</p>
 
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-2">Codeforces Username</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
 <CodeforcesIcon className="w-5 h-5" />
 </span>
 <input
 type="text"
 value={cfHandle}
 onChange={(e) => setCfHandle(e.target.value)}
 className="w-full bg-background border border-outline rounded-xl pl-12 pr-4 py-3 text-on-background focus:outline-none focus:border-emerald-500 transition-all"
 placeholder="e.g. tourist"
 />
 </div>
 </div>
 
 <div>
 <label className="block text-sm font-medium text-on-surface-variant mb-2">LeetCode Username</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
 <LeetCodeIcon className="w-5 h-5" />
 </span>
 <input
 type="text"
 value={lcHandle}
 onChange={(e) => setLcHandle(e.target.value)}
 className="w-full bg-background border border-outline rounded-xl pl-12 pr-4 py-3 text-on-background focus:outline-none focus:border-emerald-500 transition-all"
 placeholder="e.g. neetcode"
 />
 </div>
 </div>

 <div className="pt-2">
 <label className="block text-sm font-medium text-on-surface-variant mb-2">LinkedIn Username (Optional)</label>
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
 <LinkedInIcon className="w-5 h-5" />
 </span>
 <input
 type="text"
 value={linkedin}
 onChange={(e) => setLinkedin(e.target.value)}
 className="w-full bg-background border border-outline rounded-xl pl-12 pr-4 py-3 text-on-background focus:outline-none focus:border-emerald-500 transition-all"
 placeholder="e.g. johndoe"
 />
 </div>
 </div>
 </div>

 <div className="flex gap-3 mt-8">
 <button
 onClick={() => setStep(2)}
 disabled={isLoading}
 className="px-6 py-3 rounded-xl border border-outline text-on-surface-variant hover:bg-gray-50 dark:hover:bg-surface/5 transition-colors disabled:opacity-50"
 >
 Back
 </button>
 <button
 onClick={handleComplete}
 disabled={isLoading}
 className="flex-1 bg-emerald-500 text-white font-semibold rounded-xl px-4 py-3 hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
 >
 {isLoading ? (
 <>
 <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
 Setting up...
 </>
 ) : (
 "Start Grinding"
 )}
 </button>
 </div>
 </div>
 )}
 </div>
 );
}
