import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Desktop Sidebar */}
      <Sidebar userRole="ADMIN" userLevel="Expert" />

      {/* Desktop + Mobile Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-16 min-h-screen pb-20 md:pb-0">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
