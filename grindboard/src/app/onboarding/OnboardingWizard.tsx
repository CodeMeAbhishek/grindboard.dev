"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
 router.push("/feed");
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
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"><path fill="#F44336" d="M22.5 4.5h-4.5v15h4.5v-15Z"/><path fill="#2196F3" d="M14.5 9h-4.5v10.5h4.5V9Z"/><path fill="#FFC107" d="M6.5 13.5h-4.5V19.5h4.5v-6Z"/></svg>
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
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"><path fill="#FFA116" d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.939 5.939 0 0 0 1.271 1.543l5.997 5.608a3.803 3.803 0 0 0 2.722 1.132 3.802 3.802 0 0 0 2.651-1.041 3.738 3.738 0 0 0 1.121-2.617 3.739 3.739 0 0 0-1.085-2.614l-5.618-5.342c-.222-.211-.341-.497-.341-.787 0-.29.119-.575.341-.786l8.805-8.31a.586.586 0 0 0 .193-.437.587.587 0 0 0-.18-.432l-3.13-2.855a1.375 1.375 0 0 0-.963-.41zm-.008 3.529c.14.004.28.064.387.164l2.176 1.986a1.18 1.18 0 0 1 .374.872 1.179 1.179 0 0 1-.362.864l-8.595 8.113c-.63.595-.98 1.401-.98 2.247 0 .846.35 1.652.98 2.247l5.618 5.341c.219.208.513.325.823.325.311 0 .604-.117.824-.325l-6.14-5.742a4.437 4.437 0 0 1-.95-1.15 4.33 4.33 0 0 1-.26-.759 4.027 4.027 0 0 1-.046-1.768 4.015 4.015 0 0 1 .325-1.065 4.312 4.312 0 0 1 .903-1.571l3.854-4.126 5.405-5.787a.12.12 0 0 0-.007-.174l-2.176-1.986a.12.12 0 0 0-.172.007L1.93 14.542a.12.12 0 0 0 .007.174l8.36 7.643a1.176 1.176 0 0 1 .373.868 1.175 1.175 0 0 1-.373.867l-3.13 2.855a.586.586 0 0 0-.193.437.587.587 0 0 0 .193.432l5.618 5.342c.866.822 2.019 1.282 3.238 1.282 1.219 0 2.372-.46 3.238-1.282l3.13-2.855c.348-.318.544-.755.544-1.212 0-.457-.196-.894-.544-1.212L8.27 16.275a.12.12 0 0 0-.171-.007l-2.176 1.986a.12.12 0 0 0-.007.174l6.02 5.626a.584.584 0 0 0 .41.161.585.585 0 0 0 .41-.161l5.618-5.342a2.492 2.492 0 0 0 .753-1.776 2.493 2.493 0 0 0-.753-1.777l-5.618-5.341c-.63-.596-.98-1.402-.98-2.248 0-.846.35-1.652.98-2.247l8.595-8.113a2.428 2.428 0 0 0 .769-1.792 2.427 2.427 0 0 0-.769-1.79l-2.176-1.987a2.625 2.625 0 0 0-1.794-.741z"/></svg>
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
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"><path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
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
