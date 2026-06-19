export default function AppLoading() {
 return (
 <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-pulse">
 <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center mb-4">
 <span className="material-symbols-outlined text-[#10B981] animate-spin" style={{ animationDuration: '2s' }}>
 autorenew
 </span>
 </div>
 <h3 className="text-lg font-bold text-on-background">Loading your stats...</h3>
 <p className="text-sm text-on-surface-variant">Fetching from the database</p>
 </div>
 );
}
