export default function AboutPage() {
 return (
 <div className="max-w-3xl mx-auto py-12 space-y-8">
 <h1 className="text-4xl md:text-5xl font-display-xl text-on-background tracking-tight">About Grindboard</h1>
 <p className="text-lg text-on-surface-variant leading-relaxed">
 Grindboard started as a simple idea: preparing for technical interviews, GATE, and competitive programming is hard, and doing it alone is even harder. We built this platform to bring the community together and make the daily grind addictive through gamification.
 </p>
 
 <div className="space-y-6 pt-6">
 <h2 className="text-2xl font-display-xl text-on-background">Our Mission</h2>
 <p className="text-lg text-on-surface-variant leading-relaxed">
 Our mission is to help engineers crack the toughest technical interviews at MNCs, FAANG, and MAANG companies by providing a structured, accountable, and engaging environment. We believe that consistency is the key to mastering complex topics like Data Structures, Algorithms, and System Design.
 </p>
 </div>

 <div className="space-y-6 pt-6">
 <h2 className="text-2xl font-display-xl text-on-background">Why Gamification?</h2>
 <p className="text-lg text-on-surface-variant leading-relaxed">
 Traditional study tracking is boring. By introducing XP, streaks, levels, and global leaderboards, we transform the tedious process of studying into a competitive and rewarding journey. You're no longer just solving a problem; you're leveling up your engineering skills.
 </p>
 </div>

 <div className="bg-[#F0FDF4] border border-[#10B981]/20 rounded-2xl p-8 mt-12 text-center">
 <h3 className="text-xl font-bold text-[#10B981] mb-2">Join the Movement</h3>
 <p className="text-on-surface-variant mb-6">Stop grinding in silence. Start building your streak today.</p>
 <a href="/login" className="bg-[#10B981] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#059669] transition-colors inline-block">
 Get Started for Free
 </a>
 </div>
 </div>
 );
}
