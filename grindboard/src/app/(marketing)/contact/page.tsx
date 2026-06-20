export default function ContactPage() {
 return (
 <div className="max-w-2xl mx-auto py-12 space-y-8">
 <div className="text-center space-y-4">
 <div className="w-16 h-16 bg-[#F0FDF4] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-6">
 <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
 </div>
 <h1 className="text-4xl md:text-5xl font-display-xl text-on-background tracking-tight">Contact Us</h1>
 <p className="text-lg text-on-surface-variant">Have a question, feedback, or need support? We'd love to hear from you.</p>
 </div>

 <div className="bg-surface border border-outline rounded-2xl p-8 shadow-sm">
 <form action="https://formsubmit.co/abhishekhttp30@gmail.com" method="POST" encType="multipart/form-data" className="space-y-6">
 <input type="hidden" name="_subject" value="New message from Grindboard Contact Form!" />
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="font-label-mono text-xs text-on-surface-variant uppercase">First Name</label>
 <input type="text" name="first_name" required className="w-full border border-outline rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors bg-background" placeholder="Harshraj" />
 </div>
 <div className="space-y-2">
 <label className="font-label-mono text-xs text-on-surface-variant uppercase">Last Name</label>
 <input type="text" name="last_name" required className="w-full border border-outline rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors bg-background" placeholder="Gohil" />
 </div>
 </div>
 
 <div className="space-y-2">
 <label className="font-label-mono text-xs text-on-surface-variant uppercase">Email Address</label>
 <input type="email" name="email" required className="w-full border border-outline rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors bg-background" placeholder="youremail@gmail.com" />
 </div>

 <div className="space-y-2">
 <label className="font-label-mono text-xs text-on-surface-variant uppercase">Message</label>
 <textarea name="message" required rows={5} className="w-full border border-outline rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors resize-none bg-background" placeholder="How can we help you?"></textarea>
 </div>

 <div className="space-y-2">
 <label className="font-label-mono text-xs text-on-surface-variant uppercase">Attachment (Optional)</label>
 <input type="file" name="attachment" accept="image/png, image/jpeg, application/pdf" className="w-full border border-outline rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10B981] transition-colors text-on-surface-variant bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#10B981]/10 file:text-[#10B981] hover:file:bg-[#10B981]/20 file:transition-colors cursor-pointer" />
 </div>

 <button type="submit" className="w-full bg-[#10B981] text-white font-bold py-3 rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2">
 Send Message
 <span className="material-symbols-outlined text-sm">send</span>
 </button>
 </form>
 </div>
 
 <div className="text-center pt-8 text-on-surface-variant">
 <p>Or email us directly at <a href="mailto:abhishekhttp30@gmail.com" className="text-[#10B981] font-medium hover:underline">abhishekhttp30@gmail.com</a></p>
 </div>
 </div>
 );
}
