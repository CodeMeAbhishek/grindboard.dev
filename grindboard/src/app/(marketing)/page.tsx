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
 <p>Join an elite community of ambitious engineers crushing their goals daily.</p>
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
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] h-full">
    {/* Center */}
    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '0s' }}>
      <div className="w-28 h-28 bg-surface rounded-[2rem] shadow-2xl flex items-center justify-center border border-outline/50 z-20 overflow-hidden p-4 bg-white">
        <Image src="/logos/gs.png" alt="Goldman Sachs Logo" width={80} height={80} className="object-contain w-20 h-20" />
      </div>
    </div>

    {/* Top Row */}
    <div className="absolute top-[5%] left-[20%] animate-float" style={{ animationDelay: '0.5s' }}>
      <div className="w-16 h-16 bg-surface rounded-[1rem] shadow-lg flex items-center justify-center border border-outline/50 rotate-[-12deg] overflow-hidden p-2 bg-white">
        <Image src="/logos/google.png" alt="Google Logo" width={48} height={48} className="object-contain w-12 h-12" />
      </div>
    </div>
    
    <div className="absolute top-[0%] left-[50%] -translate-x-1/2 animate-float" style={{ animationDelay: '1.2s' }}>
      <div className="w-20 h-20 bg-surface rounded-[1.5rem] shadow-md flex items-center justify-center border border-outline/50 rotate-[5deg] overflow-hidden p-3 bg-white">
        <Image src="/logos/bny.png" alt="BNY Logo" width={56} height={56} className="object-contain w-14 h-14" />
      </div>
    </div>

    <div className="absolute top-[5%] right-[20%] animate-float" style={{ animationDelay: '0.8s' }}>
      <div className="w-16 h-16 bg-surface rounded-[1rem] shadow-lg flex items-center justify-center border border-outline/50 rotate-[15deg] overflow-hidden p-2 bg-white">
        <Image src="/logos/unify.png" alt="Unify Apps Logo" width={48} height={48} className="object-contain w-12 h-12" />
      </div>
    </div>

    {/* Middle-ish outer ring */}
    <div className="absolute top-[25%] left-[0%] animate-float" style={{ animationDelay: '1.5s' }}>
      <div className="w-20 h-20 bg-surface rounded-[1.5rem] shadow-md flex items-center justify-center border border-outline/50 rotate-[-8deg] overflow-hidden p-3 bg-white">
        <Image src="/logos/logo4.png" alt="Netflix Logo" width={56} height={56} className="object-contain w-14 h-14" />
      </div>
    </div>

    <div className="absolute top-[30%] right-[0%] animate-float" style={{ animationDelay: '2.1s' }}>
      <div className="w-20 h-20 bg-surface rounded-[1.5rem] shadow-xl flex items-center justify-center border border-outline/50 rotate-[10deg] overflow-hidden p-3 bg-white">
        <Image src="/logos/logo3.png" alt="Meta Logo" width={56} height={56} className="object-contain w-14 h-14" />
      </div>
    </div>

    {/* Bottom Row */}
    <div className="absolute top-[75%] left-[10%] animate-float" style={{ animationDelay: '1.8s' }}>
      <div className="w-24 h-24 bg-surface rounded-[1.8rem] shadow-lg flex items-center justify-center border border-outline/50 rotate-[-15deg] overflow-hidden p-4 bg-white">
        <Image src="/logos/sprinklr.png" alt="Sprinklr Logo" width={64} height={64} className="object-contain w-16 h-16" />
      </div>
    </div>

    <div className="absolute top-[90%] left-[50%] -translate-x-1/2 animate-float" style={{ animationDelay: '2.5s' }}>
      <div className="w-16 h-16 bg-surface rounded-[1rem] shadow-md flex items-center justify-center border border-outline/50 rotate-[8deg] overflow-hidden p-2 bg-white">
        <Image src="/logos/obsidian.png" alt="Obsidian Capital Logo" width={48} height={48} className="object-contain w-12 h-12" />
      </div>
    </div>

    <div className="absolute top-[75%] right-[10%] animate-float" style={{ animationDelay: '0.3s' }}>
      <div className="w-24 h-24 bg-surface rounded-[1.8rem] shadow-xl flex items-center justify-center border border-outline/50 rotate-[12deg] overflow-hidden p-4 bg-white">
        <Image src="/logos/wf.png" alt="Wells Fargo Logo" width={64} height={64} className="object-contain w-16 h-16" />
      </div>
    </div>

    {/* Fillers */}
    <div className="absolute top-[50%] left-[10%] -translate-y-1/2 animate-float" style={{ animationDelay: '0.9s' }}>
      <div className="w-16 h-16 bg-surface rounded-[1rem] shadow-md flex items-center justify-center border border-outline/50 rotate-[20deg] overflow-hidden bg-white">
        <Image src="/logos/logo2.png" alt="Amazon Logo" width={48} height={48} className="object-contain w-10 h-10" />
      </div>
    </div>

    <div className="absolute top-[55%] right-[15%] animate-float" style={{ animationDelay: '1.7s' }}>
      <div className="w-16 h-16 bg-surface rounded-[1rem] shadow-md flex items-center justify-center border border-outline/50 rotate-[-20deg] overflow-hidden bg-white">
        <Image src="/logos/logo1.png" alt="Google Logo 2" width={48} height={48} className="object-contain w-10 h-10" />
      </div>
    </div>

    <div className="absolute top-[90%] left-[25%] animate-float" style={{ animationDelay: '2.2s' }}>
      <div className="w-16 h-16 bg-surface rounded-[1rem] shadow-md flex items-center justify-center border border-outline/50 rotate-[15deg] overflow-hidden bg-white">
        <Image src="/logos/logo5.png" alt="Facebook Logo" width={48} height={48} className="object-contain w-10 h-10" />
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
  Get direct access to exclusive interview notes and authentic questions from software engineers placed at JP Morgan Chase, DeShaw, and top MNCs like FANG & MANG. Keep your eyes on the prize and prepare methodically for top-tier tech interviews.
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

  {/* Real Interview Data Section */}
  <section className="space-y-16 py-16 border-t border-outline/30">
    <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl md:text-5xl font-display-xl text-on-background tracking-tight">The Ultimate Preparation Hub</h2>
      <p className="text-lg text-on-surface-variant">Everything you need to stay accountable, prepare effectively, and crack top-tier companies.</p>
    </div>

    {/* Feature 1: Company Wise */}
    <div className="flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl border border-outline bg-surface-container p-2 transform transition-transform hover:scale-[1.02] duration-500">
        <Image 
          src="/screenshots/company_interviews.png" 
          alt="Company Wise Interview Prep" 
          width={800} 
          height={500}
          className="w-full h-auto rounded-xl shadow-inner border border-outline/30"
        />
      </div>
      <div className="flex-1 space-y-6 order-1 md:order-2">
        <div className="w-12 h-12 bg-[#DBEAFE] text-[#2563EB] rounded-xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
        </div>
        <h3 className="text-3xl font-display-xl text-on-background tracking-tight">Company-Wise Interview Prep</h3>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          Dive deep into specific companies. View real rounds, authentic questions, selection processes, and actual candidate answers. We even track the offered stipends and full-time compensations so you know exactly what you're grinding for.
        </p>
      </div>
    </div>

    {/* Feature 2: Subject Wise */}
    <div className="flex flex-col md:flex-row items-center gap-12 pt-8">
      <div className="flex-1 space-y-6">
        <div className="w-12 h-12 bg-[#F3E8FF] text-[#9333EA] rounded-xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
        </div>
        <h3 className="text-3xl font-display-xl text-on-background tracking-tight">Subject-Wise Deep Dives</h3>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          Weak at Dynamic Programming or System Design? Filter verified interview questions by subject. Master specific topics by studying exactly how successful candidates approached and solved them in high-pressure interviews.
        </p>
      </div>
      <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl border border-outline bg-surface-container p-2 transform transition-transform hover:scale-[1.02] duration-500">
        <Image 
          src="/screenshots/subject_interviews.png" 
          alt="Subject Wise Interview Prep" 
          width={800} 
          height={500}
          className="w-full h-auto rounded-xl shadow-inner border border-outline/30"
        />
      </div>
    </div>
    {/* Feature 3: Contest Tracking */}
    <div className="flex flex-col md:flex-row items-center gap-12 pt-8">
      <div className="flex-1 order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-2xl border border-outline bg-surface-container p-2 transform transition-transform hover:scale-[1.02] duration-500">
        <Image 
          src="/screenshots/contest_tracker.png" 
          alt="Live Contest Tracking" 
          width={800} 
          height={500}
          className="w-full h-auto rounded-xl shadow-inner border border-outline/30"
        />
      </div>
      <div className="flex-1 space-y-6 order-1 md:order-2">
        <div className="w-12 h-12 bg-[#D1FAE5] text-[#059669] rounded-xl flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>radar</span>
        </div>
        <h3 className="text-3xl font-display-xl text-on-background tracking-tight">Live Contest Tracking</h3>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          Never miss a Codeforces round or LeetCode weekly again. See exactly when contests go LIVE, track upcoming global competitive programming matches, and see which top engineers from our community participated. 
        </p>
      </div>
    </div>
  </section>

 {/* Benefits Grid */}
 <section className="space-y-12">
 <div className="text-center space-y-4 max-w-3xl mx-auto">
 <h2 className="text-3xl md:text-5xl font-display-xl text-on-background tracking-tight">Everything you need to stay consistent.</h2>
 <p className="text-lg text-on-surface-variant">We've combined the best elements of gamification with serious study tools to make the grind addictive.</p>
 </div>
 
 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
 {/* Feature 1 */}
 <div className="bg-surface border border-outline p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
 <div className="w-12 h-12 bg-[#FEF3C7] text-[#D97706] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
 </div>
 <h3 className="text-xl font-bold text-on-background mb-3">Streaks & Gamification</h3>
 <p className="text-on-surface-variant leading-relaxed">
 Log your daily LeetCode problems, CP contests, or study hours. Maintain your global streak and level up your profile like an RPG.
 </p>
 </div>
 
 {/* Feature 2 */}
 <div className="bg-surface border border-outline p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
 <div className="w-12 h-12 bg-[#DBEAFE] text-[#2563EB] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
 </div>
 <h3 className="text-xl font-bold text-on-background mb-3">Community Leaderboards</h3>
 <p className="text-on-surface-variant leading-relaxed">
 Nothing beats friendly competition. Join groups, compare your ratings, and see who's dominating the weekly hustle on the global leaderboard.
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

 {/* Feature 4 */}
 <div className="bg-surface border border-outline p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
 <div className="w-12 h-12 bg-[#D1FAE5] text-[#059669] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
 <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
 </div>
 <h3 className="text-xl font-bold text-on-background mb-3">Campus Contests</h3>
 <p className="text-on-surface-variant leading-relaxed">
 We host exclusive, high-stakes programming contests directly on your university campus. Compete locally, earn massive recognition, and win cash prizes.
 </p>
 </div>
 </div>
 </section>

  {/* The Origin Story */}
  <section className="bg-surface-container/50 border border-outline rounded-3xl p-8 md:p-16 shadow-panel relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#10B981]/10 to-transparent pointer-events-none" />
    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 max-w-5xl mx-auto">
      <div className="flex-1 order-2 md:order-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DBEAFE] text-[#2563EB] font-label-mono text-xs uppercase tracking-wider mx-auto md:mx-0">
          The Origin Story
        </div>
        <h2 className="text-3xl md:text-5xl font-display-xl text-on-background tracking-tight">
          Built by a grinder, <br /> for grinders.
        </h2>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          The idea for Grindboard started when I attended the ACM Summer School on Competitive Programming at DAIICT. Our team, WELOVECP, ranked 1st among all teams, but the experience opened my eyes. I realized that to keep up with the top students across India, maintain relentless consistency, and consolidate the absolute best interview resources into one place, we needed a dedicated platform. 
        </p>
        <p className="text-lg text-on-surface-variant leading-relaxed font-medium italic">
          That's why Grindboard was built—to gamify the hustle and help ambitious engineers reach the top.
        </p>
      </div>
      <div className="order-1 md:order-2 flex flex-col items-center space-y-4">
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-surface shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
          <Image 
            src="/creator_avatar.jpeg" 
            alt="Abhishek Gupta" 
            fill
            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <a 
          href="https://www.linkedin.com/in/abhishek-gupta-622033331/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] text-white rounded-full font-bold hover:bg-[#004182] transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Connect with Abhishek
        </a>
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
