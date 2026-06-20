export default function TermsPage() {
 return (
 <div className="max-w-3xl mx-auto py-12 space-y-8">
 <h1 className="text-4xl md:text-5xl font-display-xl text-on-background tracking-tight">Terms of Service</h1>
 <p className="text-on-surface-variant">Last updated: {new Date().toLocaleDateString()}</p>
 
 <div className="prose prose-lg text-on-background">
 <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
 <p className="text-on-surface-variant mb-4">
 By accessing and using Grindboard.dev, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
 </p>

 <h2 className="text-2xl font-bold mt-8 mb-4">2. User Accounts</h2>
 <p className="text-on-surface-variant mb-4">
 You are responsible for maintaining the confidentiality of your account credentials. Grindboard reserves the right to terminate accounts that violate our community guidelines, including but not limited to spamming, abuse, or attempting to exploit the gamification engine.
 </p>

 <h2 className="text-2xl font-bold mt-8 mb-4">3. Content and Conduct</h2>
 <p className="text-on-surface-variant mb-4">
 Users are expected to interact respectfully on the platform. Any notes, logs, or public display names must not contain offensive, discriminatory, or inappropriate content.
 </p>

 <h2 className="text-2xl font-bold mt-8 mb-4">4. Platform Provided As-Is</h2>
 <p className="text-on-surface-variant mb-4">
 Grindboard is provided "as is" without warranties of any kind. We strive for 99.9% uptime but do not guarantee uninterrupted service, especially during scheduled maintenance windows or upstream provider outages.
 </p>
 </div>
 </div>
 );
}
