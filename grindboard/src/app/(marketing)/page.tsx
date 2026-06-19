import Link from "next/link";
import Image from "next/image";


export default function LandingPage() {
 return (
 <div className="space-y-32">
 {/* Hero Section */}
 <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 pt-10">
 <div className="flex-1 space-y-6 text-center lg:text-left">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF4] border border-[#10B981]/20 text-[#10B981] font-label-mono text-xs uppercase tracking-wider mx-auto lg:mx-0">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
 </span>
 The Ultimate Accountability Layer
 </div>
 <h1 className="text-5xl md:text-7xl font-display-xl text-on-background tracking-tighter leading-[1.1]">
 Gamify Your <br className="hidden md:block"/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#059669]">Engineering Grind</span>
 </h1>
 <p className="text-lg md:text-xl italic font-bold text-on-background max-w-2xl mx-auto lg:mx-0">
 "Don't get left behind. Join the inner circle of top programmers to stay accountable, get direct advice, and dominate contests together. Prove your consistency, climb the leaderboard, and unlock direct FANG/MANG referrals. If you aren't grinding here, you're missing out."
 </p>
 <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
 <Link href="/login" className="w-full sm:w-auto bg-[#10B981] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#059669] transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
 Start Grinding Now
 <span className="material-symbols-outlined">arrow_forward</span>
 </Link>
 <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-on-surface-variant hover:text-on-background transition-all text-lg flex items-center justify-center gap-2">
 View Features
 </a>
 </div>
 <div className="pt-6 flex items-center gap-4 justify-center lg:justify-start text-sm font-label-mono text-on-surface-variant">
 <div className="flex -space-x-3">
 {[1, 2, 3, 4].map(i => (
 <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white z-${5-i}`} style={{ backgroundColor: ['#10B981', '#0EA5E9', '#F59E0B', '#8B5CF6'][i-1] }}>
 U{i}
 </div>
 ))}
 </div>
 <p>Join 1,000+ engineers crushing their goals daily.</p>
 </div>
 </div>
 <div className="flex-1 relative animate-float">
 <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/20 to-transparent blur-3xl -z-10 rounded-full" />
 <Image 
 src="/fang_trophy.png" 
 alt="Grindboard Abstract Hero Graphic" 
 width={600} 
 height={600}
 className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
 priority
 />
 </div>
 </section>

 {/* Crack FAANG Section */}
 <section id="features" className="bg-surface border border-outline rounded-3xl p-8 md:p-16 shadow-panel relative overflow-hidden">
 <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#F0FDF4] dark:from-[#10B981]/10 to-transparent pointer-events-none" />
 <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
 <div className="flex-1 order-2 md:order-1 relative h-[400px] w-full">
  {/* Floating Logos Composition */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-full">
  <div className="absolute top-[10%] left-[15%] animate-float" style={{ animationDelay: '0s' }}>
  <div className="w-20 h-20 bg-surface rounded-[1.5rem] shadow-xl flex items-center justify-center border border-outline/50 rotate-[-12deg] overflow-hidden">
  <Image src="/logos/logo1.png" alt="Company Logo" width={48} height={48} className="object-contain w-10 h-10" />
  </div>
  </div>
  
  <div className="absolute top-[65%] left-[5%] animate-float" style={{ animationDelay: '1s' }}>
  <div className="w-24 h-24 bg-surface rounded-[1.8rem] shadow-lg flex items-center justify-center border border-outline/50 rotate-[15deg] overflow-hidden">
  <Image src="/logos/logo2.png" alt="Company Logo" width={64} height={64} className="object-contain w-12 h-12" />
  </div>
  </div>

  <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '2s' }}>
  <div className="w-32 h-32 bg-surface rounded-[2rem] shadow-2xl flex items-center justify-center border border-outline/50 z-10 overflow-hidden">
  <Image src="/logos/logo3.png" alt="Company Logo" width={96} height={96} className="object-contain w-20 h-20" />
  </div>
  </div>

  <div className="absolute top-[15%] right-[10%] animate-float" style={{ animationDelay: '1.5s' }}>
  <div className="w-20 h-20 bg-surface rounded-[1.5rem] shadow-lg flex items-center justify-center border border-outline/50 rotate-[20deg] overflow-hidden">
  <Image src="/logos/logo4.png" alt="Company Logo" width={48} height={48} className="object-contain w-10 h-10" />
  </div>
  </div>

  <div className="absolute top-[60%] right-[15%] animate-float" style={{ animationDelay: '0.5s' }}>
  <div className="w-24 h-24 bg-surface rounded-[1.8rem] shadow-xl flex items-center justify-center border border-outline/50 rotate-[-15deg] overflow-hidden">
  <Image src="/logos/logo5.png" alt="Company Logo" width={64} height={64} className="object-contain w-12 h-12" />
  </div>
  </div>
  </div>
 </div>
 <div className="flex-1 space-y-6 order-1 md:order-2">
 <div className="w-12 h-12 bg-[#F0FDF4] text-[#10B981] rounded-xl flex items-center justify-center mb-6">
 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
 </div>
 <h2 className="text-3xl md:text-5xl font-display-xl text-on-background tracking-tight">
 Built to crack <br/> <span className="text-[#10B981]">MNCs, FANG & MANG</span>
 </h2>
 <p className="text-lg text-on-surface-variant">
 Don't just solve problems blindly. Grindboard provides structured module tracking for Data Structures, Algorithms, System Design, and Machine Learning. Keep your eyes on the prize and prepare methodically for top-tier tech interviews.
 </p>
 <ul className="space-y-3 pt-4">
 {[
 "Curated topic tracking for rigorous technical interviews.",
 "Integrate your LeetCode metrics directly.",
 "Focus hours tracking for deep-work sessions.",
 "Accountability mechanisms to ensure you don't skip a day."
 ].map((item, i) => (
 <li key={i} className="flex items-start gap-3">
 <span className="material-symbols-outlined text-[#10B981] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
 <span className="text-on-background">{item}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </section>

 {/* Benefits Grid */}
 <section className="space-y-12">
 <div className="text-center space-y-4 max-w-3xl mx-auto">
 <h2 className="text-3xl md:text-5xl font-display-xl text-on-background tracking-tight">Everything you need to stay consistent.</h2>
 <p className="text-lg text-on-surface-variant">We've combined the best elements of gamification with serious study tools to make the grind addictive.</p>
 </div>
 
 <div className="grid md:grid-cols-3 gap-6">
 {/* Feature 1 */}
 <div className="bg-surface border border-outline p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
 <div className="w-12 h-12 bg-[#FEF3C7] text-[#D97706] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
 </div>
 <h3 className="text-xl font-bold text-on-background mb-3">Streaks & XP</h3>
 <p className="text-on-surface-variant leading-relaxed">
 Log your daily LeetCode problems, CP contests, or study hours to earn XP. Maintain your global streak and level up your profile like an RPG.
 </p>
 </div>
 
 {/* Feature 2 */}
 <div className="bg-surface border border-outline p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
 <div className="w-12 h-12 bg-[#DBEAFE] text-[#2563EB] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
 </div>
 <h3 className="text-xl font-bold text-on-background mb-3">Community Leaderboards</h3>
 <p className="text-on-surface-variant leading-relaxed">
 Nothing beats friendly competition. Join groups, compare your XP, and see who's dominating the weekly hustle on the global leaderboard.
 </p>
 </div>

 {/* Feature 3 */}
 <div className="bg-surface border border-outline p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
 <div className="w-12 h-12 bg-[#F3E8FF] text-[#9333EA] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
 </div>
 <h3 className="text-xl font-bold text-on-background mb-3">Contest Radar</h3>
 <p className="text-on-surface-variant leading-relaxed">
 Never miss a Codeforces round or LeetCode weekly again. Track upcoming contests, sync them, and log your results to impact your global rank.
 </p>
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="bg-[#1A1A1A] rounded-3xl p-12 text-center relative overflow-hidden">
 <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/10 to-transparent" />
 <div className="relative z-10 max-w-2xl mx-auto space-y-8">
 <h2 className="text-4xl md:text-5xl font-display-xl text-white tracking-tight">Ready to join the 1%?</h2>
 <p className="text-[#9CA3AF] text-lg">
 The journey to top-tier tech companies requires consistency. Grindboard is here to keep you accountable every single day.
 </p>
 <Link href="/login" className="inline-flex bg-[#10B981] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#059669] transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 items-center gap-2">
 Create Free Account
 <span className="material-symbols-outlined">rocket_launch</span>
 </Link>
 </div>
 </section>
 </div>
 );
}
