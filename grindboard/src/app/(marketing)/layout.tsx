import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#10B981] selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5] z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              track_changes
            </span>
          </div>
          <Link href="/" className="font-display-xl text-lg tracking-tight text-[#1A1A1A]">grindboard.dev</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="font-label-mono text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors hidden md:block">About</Link>
          <Link href="/contact" className="font-label-mono text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors hidden md:block">Contact</Link>
          <Link href="/login" className="font-label-mono text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors">Sign In</Link>
          <Link href="/login" className="bg-[#10B981] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#059669] transition-all text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                track_changes
              </span>
            </div>
            <span className="font-display-xl text-md tracking-tight text-[#1A1A1A]">grindboard.dev</span>
          </div>
          <div className="text-[#6B7280] font-label-mono text-sm flex gap-4">
            <Link href="/privacy" className="hover:text-[#10B981] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#10B981] transition-colors">Terms of Service</Link>
            <span>© {new Date().getFullYear()} Grindboard.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#6B7280] hover:text-[#10B981] transition-colors"><span className="material-symbols-outlined">code</span></a>
            <a href="#" className="text-[#6B7280] hover:text-[#10B981] transition-colors"><span className="material-symbols-outlined">forum</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
