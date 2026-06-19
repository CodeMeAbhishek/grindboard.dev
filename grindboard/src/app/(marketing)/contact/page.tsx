export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#F0FDF4] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display-xl text-[#1A1A1A] tracking-tight">Contact Us</h1>
        <p className="text-lg text-[#6B7280]">Have a question, feedback, or need support? We'd love to hear from you.</p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 shadow-sm">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label-mono text-xs text-[#6B7280] uppercase">First Name</label>
              <input type="text" className="w-full border border-[#E5E5E5] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="font-label-mono text-xs text-[#6B7280] uppercase">Last Name</label>
              <input type="text" className="w-full border border-[#E5E5E5] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors" placeholder="Doe" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="font-label-mono text-xs text-[#6B7280] uppercase">Email Address</label>
            <input type="email" className="w-full border border-[#E5E5E5] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors" placeholder="john@example.com" />
          </div>

          <div className="space-y-2">
            <label className="font-label-mono text-xs text-[#6B7280] uppercase">Message</label>
            <textarea rows={5} className="w-full border border-[#E5E5E5] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors resize-none" placeholder="How can we help you?"></textarea>
          </div>

          <button type="button" className="w-full bg-[#10B981] text-white font-bold py-3 rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2">
            Send Message
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
      
      <div className="text-center pt-8 text-[#6B7280]">
        <p>Or email us directly at <a href="mailto:hello@grindboard.dev" className="text-[#10B981] font-medium hover:underline">hello@grindboard.dev</a></p>
      </div>
    </div>
  );
}
